(function () {
  // Set first: styles.css only hides languages once this is present, so a
  // script error before this line (e.g. a parse failure) degrades to all
  // three languages shown stacked, never to none. That covers failures
  // BEFORE this line executes. Everything AFTER it runs inside the
  // try/catch below, whose catch removes this very attribute: it is what
  // authorises the stylesheet to hide any [data-lang] section, so any
  // failure to complete setup must withdraw that authorisation rather than
  // leave content hidden with nothing left running to recover it. That
  // makes "zero active sections" structurally impossible for ANY setup
  // failure, not just the specific ones resolveLang() (below) is built to
  // handle — showing the wrong language is a cosmetic bug, showing none is
  // a legal-content outage.
  document.documentElement.dataset.js = "on";

  try {
  var HASH = { portugues: "pt", espanol: "es", top: "en" };
  var LANG_ATTR = { en: "en", pt: "pt-BR", es: "es" };

  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-lang]"));
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));

  // ---- one-time structural wiring ---------------------------------------
  // Contract with tasks 5-8: the HTML need only provide `data-lang` on each
  // section and `role="tab"` + `data-lang-target` on each control. Every
  // attribute below is stamped on by this script at load time and must NOT
  // be hand-authored in the markup (a hand-authored id could collide with
  // one generated here):
  //   - role="tabpanel" on every [data-lang] section.
  //   - an id on every [data-lang] section (an existing id is left alone; a
  //     missing one is generated).
  //   - aria-controls on every [role="tab"], pointing at the id of the
  //     FIRST [data-lang] section whose data-lang matches that tab's
  //     data-lang-target — the only section of that language that can ever
  //     become active (see "first match only" in apply() below).
  //   - aria-hidden, added/removed on every language switch to pull
  //     inactive panels out of the accessibility tree (belt-and-braces
  //     alongside the CSS display:none rule).
  var firstSectionIdForLang = {};
  sections.forEach(function (s, i) {
    s.setAttribute("role", "tabpanel");
    if (!s.id) s.id = "lang-panel-" + (s.dataset.lang || i) + "-" + i;
    if (!(s.dataset.lang in firstSectionIdForLang)) {
      firstSectionIdForLang[s.dataset.lang] = s.id;
    }
  });
  tabs.forEach(function (t) {
    var id = firstSectionIdForLang[t.dataset.langTarget];
    if (id) t.setAttribute("aria-controls", id);
  });

  // `data-i18n-en` is the marker attribute every translatable element must
  // carry (even if its own baseline text already IS the English copy). Each
  // such element's authored textContent is captured once, here, before any
  // language switch can overwrite it, and becomes the fallback used
  // whenever the active language has no `data-i18n-<lang>` override — so
  // e.g. PT -> ES on an element with no data-i18n-es restores this baseline
  // instead of leaving stale Portuguese on screen.
  var i18nEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-en]"));
  i18nEls.forEach(function (el) { el.dataset.i18nBaseline = el.textContent; });

  function pick() {
    var h = (location.hash || "").replace("#", "").toLowerCase();
    if (HASH[h]) return HASH[h];
    var n = (navigator.language || "en").toLowerCase();
    if (n.indexOf("pt") === 0) return "pt";
    if (n.indexOf("es") === 0) return "es";
    return "en";
  }

  // A requested language that matches no section falls back to "en"; if
  // even "en" has no section, the first [data-lang] section in document
  // order wins. This is what makes "zero active sections" impossible.
  function resolveLang(lang) {
    var i;
    for (i = 0; i < sections.length; i++) {
      if (sections[i].dataset.lang === lang) return lang;
    }
    for (i = 0; i < sections.length; i++) {
      if (sections[i].dataset.lang === "en") return "en";
    }
    return sections.length ? sections[0].dataset.lang : "en";
  }

  // href -> language fragment, used both for the address bar and for rewriting
  // in-site links so the chosen language survives cross-page navigation.
  var FRAG = { en: "#top", pt: "#portugues", es: "#espanol" };

  // Only the four trilingual content pages. Matching by name deliberately
  // excludes mailto:, external URLs, in-page anchors, and /get/ + /rate/
  // (single-language interstitials with no [data-lang] sections).
  var siteLinks = [].slice.call(document.querySelectorAll("a[href]")).filter(function (a) {
    var base = (a.getAttribute("href") || "").split("#")[0];
    if (!/^(index|privacy|terms|examen)\.html$/i.test(base)) return false;
    a.dataset.langBase = base;
    return true;
  });

  function apply(lang, updateHash) {
    lang = resolveLang(lang);

    var activated = false;
    sections.forEach(function (s) {
      // Two sections sharing one data-lang value (a markup bug) must still
      // yield exactly one active panel: only the first match wins.
      var on = !activated && s.dataset.lang === lang;
      if (on) activated = true;
      s.toggleAttribute("data-lang-active", on);
      if (on) s.removeAttribute("aria-hidden");
      else s.setAttribute("aria-hidden", "true");
    });

    tabs.forEach(function (t) {
      var on = t.dataset.langTarget === lang;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });

    i18nEls.forEach(function (el) {
      var v = el.getAttribute("data-i18n-" + lang);
      el.textContent = v != null ? v : el.dataset.i18nBaseline;
    });

    document.documentElement.lang = LANG_ATTR[lang] || lang;

    // Carry the chosen language across the site. The nav and footer links are
    // authored as plain "privacy.html" so that with JS off they still work and
    // land on the stacked all-languages page. With JS on, a reader who picked
    // Portuguese and then clicked "Privacidade" would otherwise arrive with no
    // hash, and pick() would fall back to navigator.language — handing an
    // English-locale browser back an English page and silently discarding the
    // choice. Rewriting the fragment keeps the selection sticky and keeps the
    // URL shareable. Restricted to the four content pages by name: /get/ and
    // /rate/ have no language sections, and external links must not be touched.
    var frag = FRAG[lang] || "#top";
    siteLinks.forEach(function (a) {
      a.setAttribute("href", a.dataset.langBase + frag);
    });

    if (updateHash) {
      history.replaceState(null, "", frag);
    }
  }

  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { apply(t.dataset.langTarget, true); });
    t.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var next = tabs[(i + d + tabs.length) % tabs.length];
      next.focus(); apply(next.dataset.langTarget, true);
    });
  });

  apply(pick(), false);
  window.addEventListener("hashchange", function () { apply(pick(), false); });

  } catch (err) {
    // Setup did not complete, so withdraw the authorisation data-js grants
    // the stylesheet to hide content: without it, the no-JS stylesheet
    // branch takes over and all three languages render stacked, exactly
    // the known-good degraded state this design already relies on for a
    // script that never ran at all. Never rethrow past this point.
    document.documentElement.removeAttribute("data-js");
    console.error("site.js: language-tab setup failed, falling back to no-JS presentation", err);
  }
})();
