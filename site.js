(function () {
  // Set first: styles.css only hides languages when this is present, so a
  // parse error here degrades to all three languages stacked, never to none.
  document.documentElement.dataset.js = "on";

  var HASH = { portugues: "pt", espanol: "es", top: "en" };
  var LANG_ATTR = { en: "en", pt: "pt-BR", es: "es" };

  function pick() {
    var h = (location.hash || "").replace("#", "").toLowerCase();
    if (HASH[h]) return HASH[h];
    var n = (navigator.language || "en").toLowerCase();
    if (n.indexOf("pt") === 0) return "pt";
    if (n.indexOf("es") === 0) return "es";
    return "en";
  }

  function apply(lang, updateHash) {
    document.querySelectorAll("[data-lang]").forEach(function (s) {
      s.toggleAttribute("data-lang-active", s.dataset.lang === lang);
    });
    document.querySelectorAll('[role="tab"]').forEach(function (t) {
      var on = t.dataset.langTarget === lang;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    document.querySelectorAll("[data-i18n-en]").forEach(function (el) {
      var v = el.getAttribute("data-i18n-" + lang);
      if (v) el.textContent = v;
    });
    document.documentElement.lang = LANG_ATTR[lang];
    if (updateHash) {
      var frag = lang === "pt" ? "#portugues" : lang === "es" ? "#espanol" : "#top";
      history.replaceState(null, "", frag);
    }
  }

  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
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
})();
