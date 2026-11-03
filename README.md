# Pew Pal — Support Site

Static support and legal site for **Pew Pal**, the Catholic Mass companion app for iOS and Android.

Plain HTML, no build step. Served by **GitHub Pages** from the `main` branch root
(`source: main /`), so anything pushed to root is live within a minute:

**https://branicio.github.io/pewpal-support/**

---

## Live URLs

### Primary — registered in App Store Connect / Google Play and linked from the app's Settings screen

| Page | URL |
|---|---|
| Support page (home) | https://branicio.github.io/pewpal-support/ |
| Privacy Policy | https://branicio.github.io/pewpal-support/privacy.html |
| Terms of Use | https://branicio.github.io/pewpal-support/terms.html |

### Also live

| Page | URL | Purpose |
|---|---|---|
| Get Pew Pal | https://branicio.github.io/pewpal-support/get/ | OS-detecting store smart link |
| Rate Pew Pal | https://branicio.github.io/pewpal-support/rate/ | Write-a-review deep link |
| Examination of Conscience | https://branicio.github.io/pewpal-support/examen.html | Six-language examen (EN/PT/ES/FR/IT/DE), linked from the home page |
| Impressum / Legal notice | https://branicio.github.io/pewpal-support/impressum.html | EU provider notice (§ 5 DDG), every language on one static page; linked from every footer, including `get/` and `rate/` |
| App icon | https://branicio.github.io/pewpal-support/app-icon.png | Shared asset |

`/get/` and `/rate/` are directories containing `index.html` — the trailing slash is the
canonical form.

---

## Files

| Path | Purpose |
|---|---|
| `index.html` | Home page — six-language landing page (English → Português → Español → Français → Italiano → Deutsch stacked sections) |
| `privacy.html` | Privacy Policy, same six-language structure |
| `terms.html` | Terms of Use, same six-language structure |
| `examen.html` | Examination of Conscience — six languages, links out to external publishers only |
| `impressum.html` | Impressum / Legal notice (2026-11-03): one static page with no `[data-lang]` sections; its text comes from `../Marketing/legal-eu/eu_legal_texts.py`, and `site.js` keeps the reader's language for its nav and footer |
| `styles.css` | The one stylesheet for all four content pages: design tokens (colour, type, spacing), card/nav/footer components, the `[data-lang]` show/hide rules and their no-JS fallback, and the `[data-rise]` load-in animation (disabled under `prefers-reduced-motion`) |
| `site.js` | Language-tab controller — see "Languages and anchors" below. No other behaviour lives here; the smart-link pages (`get/`, `rate/`) intentionally have their own separate inline scripts, not this file |
| `fonts/` | Three self-hosted `.woff2` files (EB Garamond roman + italic, Inter) — see "Self-hosted fonts" below |
| `badges/` | Twelve vendored App Store / Google Play badge images — see "Vendored store badges" below |
| `OFL.txt` | The SIL Open Font License covering the `fonts/` files — required attribution for both EB Garamond and Inter |
| `app-icon.png` | Shared app-icon asset used as the favicon and the nav/footer brand mark on every page |
| `get/index.html`, `rate/index.html` | Single-file smart-link interstitials — see "Smart links" below |

---

## Vendored store badges (`badges/`)

The site loads **no third-party subresource anywhere** — fonts, the app icon and the twelve
App Store / Google Play badges are all served from this repo. The badges are Apple's and
Google's own artwork, downloaded byte-for-byte from:

| File | Source |
|---|---|
| `badges/app-store-en-us.svg` | `https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83` |
| `badges/app-store-pt-br.svg` | …same with `/pt-br` |
| `badges/app-store-es-mx.svg` | …same with `/es-mx` |
| `badges/app-store-fr-fr.svg` | …same with `/fr-fr` |
| `badges/app-store-it-it.svg` | …same with `/it-it` |
| `badges/app-store-de-de.svg` | …same with `/de-de` |
| `badges/google-play-en-us.png` | `https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png` |
| `badges/google-play-pt-br.png` | …same with `intl/pt-BR` + `pt-br_badge_web_generic.png` |
| `badges/google-play-es.png` | …same with `intl/es` + `es_badge_web_generic.png` |
| `badges/google-play-fr.png` | …same with `intl/fr` + `fr_badge_web_generic.png` |
| `badges/google-play-it.png` | …same with `intl/it` + `it_badge_web_generic.png` |
| `badges/google-play-de.png` | …same with `intl/de` + `de_badge_web_generic.png` |

> The Apple endpoint now answers with a redirect to
> `toolbox.marketingtools.apple.com/api/badges/…`, so fetch it with `curl -L` — without `-L`
> you save an empty file. Checked 2026-09-24: following the redirect, the `en-us` and `es-mx`
> downloads are byte-identical to the files committed here, so the redirect serves the same
> artwork and the `fr-fr` file was fetched the same way. Checked again 2026-10-27: the same
> recipe reproduced the committed `fr-fr` and `fr` files byte for byte, and the `it-it` and `it`
> files were fetched with it. Checked again 2026-11-03: the recipe reproduced the committed
> `it-it` and `it` files byte for byte, and the `de-de` and `de` files were fetched with it.

> **Never modify these files.** Apple's and Google's marketing guidelines permit hosting
> their badge art but not altering it — no recolouring, cropping, rescaling or re-encoding,
> and no running them through an image optimiser. Size them with CSS (`.badges .as/.gp`),
> never by editing the file. To refresh, re-download from the URL above and commit the new
> bytes unchanged.

Hosting rather than hotlinking is deliberate: `tools.applemediaservices.com` is an API
endpoint, not a stability contract, and local files remove two DNS+TLS handshakes from the
home page.

---

## Self-hosted fonts (`fonts/`)

`styles.css` declares three `@font-face` rules pointing at local `.woff2` files instead of a
`fonts.googleapis.com` / `fonts.gstatic.com` `<link>`:

| File | Family | Weight/style |
|---|---|---|
| `fonts/EBGaramond-latin.woff2` | EB Garamond | 500–700, roman |
| `fonts/EBGaramond-italic-latin.woff2` | EB Garamond | 500, italic |
| `fonts/Inter-latin.woff2` | Inter | 400–600, roman |

Both families are SIL Open Font License (OFL) 1.1 — see `OFL.txt`, which covers both and
must ship alongside them (the OFL requires the license text to travel with the font). Only
the `latin` subset is vendored: the redesign's characters were measured and `latin-ext` adds
zero coverage for this site's English/Portuguese/Spanish (and, since 2026-09-24, French; since
2026-10-27, Italian; since 2026-11-03, German) content, so it was dropped to keep
the payload small (3 files, ~117 KB total, down from an initial 14-file/951 KB pass).

**French (2026-09-24) needed no new font file.** Measured against the three `.woff2` cmaps:
`é è ê ë à â ç ô î ï û ù ü « » ’ —` and the no-break space U+00A0 are all in the `latin`
subset, and so are `œ`/`Œ` (U+0153/U+0152 — outside Latin-1, but Google's `latin` subset carries
them). Missing from all three files: **U+202F narrow no-break space**, `Ÿ` (U+0178) and `№`. So
the French pages put an ordinary no-break space (`&nbsp;`, U+00A0) before `: ; ? !` and inside
`« »`, never U+202F — a U+202F would silently fall back to a system font for that one glyph.
If a later edit wants the thin French space, it has to add a subset that contains it.

**Italian (2026-10-27) needed no new font file either.** Its accents are all Latin-1 —
`à è é ì ò ù` and their capitals `À È É Ì Ò Ù` — and, with `« » ’ —` and U+00A0, all are in the
three `.woff2` cmaps (measured with fontTools). Italian puts **no** space before `: ; ? !` and none
inside `« »`, so the Italian sections carry none of the French `&nbsp;`s.

**German (2026-11-03) needed no new font file either.** `ä ö ü Ä Ö Ü ß`, the German quotes
`„ “ ‚ ‘`, `’`, the en dash `–` and U+00A0 are all in the three `.woff2` cmaps (measured with
fontTools). German puts no space before `: ; ? !` and none inside `„ “`; asides take the spaced
en dash (`&ndash;`), not the em dash.

Self-hosting, same as the badges above, means **zero third-party requests of any kind** —
no Google Fonts DNS/TLS round trip, no dependency on a CDN staying up, and no way for a
third party to see a visitor's IP or User-Agent just from loading this site. This matters
more here than it would for an ordinary marketing site: this is the privacy policy for an
app whose entire pitch is "we make zero network calls," so the page that hosts that promise
has to keep it too.

---

## Navigation

Every content page carries the same sticky nav and the same footer links:

| Label (en / pt / es / fr / it / de) | Target |
|---|---|
| Home · Início · Inicio · Accueil · Home · Start | `index.html` |
| Privacy · Privacidade · Privacidad · Confidentialité · Privacy · Datenschutz | `privacy.html` |
| Terms · Termos · Términos · Conditions · Condizioni · Bedingungen | `terms.html` |
| Examination of Conscience · Exame de Consciência · Examen de Conciencia · Examen de conscience · Esame di coscienza · Gewissenserforschung | `examen.html` |
| Contact · Contato · Contacto · Contact · Contatti · Kontakt | `mailto:braniapps@gmail.com` |
| Legal notice · Aviso legal · Aviso legal · Mentions légales · Note legali · Impressum *(footer only)* | `impressum.html` |

Labels are swapped by `site.js` from `data-i18n-en` / `-pt` / `-es` / `-fr` / `-it` / `-de` attributes;
the element's authored inner text is the English baseline, so with JavaScript off the nav reads
English while all six language bodies render stacked — nothing becomes unreachable.

The German nav uses the short forms **„Start“** and **„Bedingungen“** (the footers say
„Datenschutzerklärung“ and „Nutzungsbedingungen“), as Italian and French shorten Terms to
"Condizioni" / "Conditions". With „Startseite“ and „Nutzungsbedingungen“ the German links were
615px wide and the desktop nav never fitted one row below 1280px; with the short forms it does
from ~934px, like the French (measured 2026-11-03).

Two things here are deliberate and easy to undo by accident:

- **"Contact" is a `mailto:`, not a page.** It was labelled "Support" until it was pointed
  out that the label implied a support page.
- **`.nav-links` must keep `flex-wrap: wrap`.** With five items, the longest label
  ("Examination of Conscience" / "Examen de Conciencia") overflows a 320px viewport by up to
  54px without it. The links are also deliberately NOT `display:none` on phones the way a
  decorative nav could be — they are the only cross-page navigation on the site.

## Languages and anchors

`index.html`, `privacy.html`, `terms.html` and `examen.html` are **single stacked six-language
pages** (English → Português → Español → Français → Italiano → Deutsch, in the order each language
was added), each with the same anchors:

| Anchor | Selects | Sits on | Scrolls to |
|---|---|---|---|
| `#english` | English | the `<section data-lang="en">` | top of page |
| `#portugues` | Português (pt-BR) | the `<section data-lang="pt">` | top of page |
| `#espanol` | Español | the `<section data-lang="es">` | top of page |
| `#francais` | Français (France-first, `lang="fr"`) | the `<section data-lang="fr">` | top of page |
| `#italiano` | Italiano (Italy-first, `lang="it"`) | the `<section data-lang="it">` | top of page |
| `#deutsch` | Deutsch (Germany-first, `lang="de"`) | the `<section data-lang="de">` | top of page |
| `#top` | English *(legacy alias)* | the English `<h1>` | the heading |

Example: https://branicio.github.io/pewpal-support/privacy.html#espanol

**Why `#top` and `#english` both exist and both mean English.** `#top` is the
skip-link target, where landing *on the heading* is the correct behaviour for someone
skipping the nav — but that put English ~200px lower than the other languages, whose
anchors sit on the `<section>`. `#english` was added on the section so every language
scrolls identically. `#top` is kept, and still selects English, because external links to
`privacy.html#top` predate this and must keep working. Do not "tidy up" by deleting either
one: removing `#top` breaks old links and the skip link, removing `#english` reintroduces
the scroll discrepancy.

> **Store listings deliberately use the BASE URLs above for every locale**
> (en-US, pt-BR, es-MX, es-ES, fr-FR, it — and de-DE with 1.12.0) — **no `#anchor` deep-links.** This keeps the locales
> consistent, and the Terms link lives inside the App Store description, which cannot be
> changed without a new version and a review cycle. If anchor deep-linking is ever adopted,
> do it for every locale at once, as a planned release change and not a hotfix.

### How the language tabs work (`site.js`)

`index.html`, `privacy.html`, `terms.html` and `examen.html` each render all six
languages as sibling `<section data-lang="en|pt|es|fr|it|de">` elements. `site.js` is what turns
that into a tabbed view:

- On load it reads `location.hash` (`#english` or `#top` → en, `#portugues` → pt,
  `#espanol` → es, `#francais` → fr, `#italiano` → it, `#deutsch` → de); if the hash is empty or
  unrecognised it falls back to `navigator.language` (`pt*`, `es*`, `fr*`, `it*`, `de*` — so
  de-DE, de-AT, de-CH and the rest), then to English.
- **The `it*` fallback is what lands the apps' Italian readers on Italian.** As of 1.11.0 both
  apps open the bare pages for Italian: `PaywallCopy.supportURL` (iOS) / `PaywallCopy.supportUrl`
  (Android), used for privacy and terms, add `#portugues` / `#espanol` / `#francais` and nothing
  for Italian, and the examen screens (`ExaminationView.openExamen`, `ExaminationScreen.kt`) add
  only `#portugues` / `#espanol` (French opens the bare examen page too, although `#francais`
  exists there). So an Italian browser gets Italian, while a reader who set the app to Italian on
  a phone in another language gets that language. Adding `#italiano` (and, for the examen,
  `#francais`) to those functions closes the gap; Android's `ItalianLocalizationTest` currently
  pins the bare URL for Italian.
- **German (1.12.0) is designed to close that gap for every language.** The German design
  (decision 13) has both apps add each language's own fragment — `#deutsch` included — to the
  support, privacy, terms and examen links. Until that release is live, the `de*` fallback is
  what lands a German browser on German.
- **It rewrites in-site links to carry the active language.** The nav and footer links are
  authored as plain `privacy.html` so they still work with JavaScript off; with JS on,
  `apply()` appends the current language fragment to every link pointing at `index.html`,
  `privacy.html`, `terms.html`, `examen.html` or `impressum.html`. Without this, a reader who picked
  Português and then clicked "Privacidade" arrived with no hash and got English back via
  `navigator.language` — which is what an English-locale phone reports even when its owner
  is reading in Portuguese. `mailto:`, external URLs, in-page anchors and the
  single-language `get/` + `rate/` interstitials are deliberately excluded by filename.
- Clicking a language tab (`role="tab"`, `EN`/`PT`/`ES`/`FR`/`IT`/`DE` in the nav) shows that language's
  section, hides the other five (`data-lang-active` + `aria-hidden`), sets
  `document.documentElement.lang`, and updates `location.hash` via `history.replaceState`
  (so the URL becomes shareable without adding a back-button entry per click).
- Left/Right arrow keys move focus and selection between tabs, standard ARIA tablist
  behaviour.
- Navigating directly to `#portugues`, `#espanol`, `#francais`, `#italiano` or `#deutsch` (or reloading on one) selects that
  language on load — this is exactly what the anchor deep-links above rely on.

**No-JS fallback.** `site.js` only sets `document.documentElement.dataset.js = "on"` as its
very first statement, and only `styles.css` rules scoped under `html[data-js="on"]` hide the
inactive `[data-lang]` sections. That means:
- With JavaScript disabled entirely, `data-js` is never set, the CSS hiding rule never
  matches, and all six languages render stacked on one page, top to bottom — still fully
  readable, still fully linkable via `#top`/`#portugues`/`#espanol`/`#francais`/`#italiano`/`#deutsch` (the browser's native
  in-page anchor scroll works with zero script). This is the safety net for a JS-less
  visitor or an App Store reviewer.
- If `site.js` throws partway through setup, its `catch` block explicitly *removes*
  `data-js` again and logs to `console.error` — it never rethrows — which hands control
  back to the same no-JS stylesheet branch. So a script error degrades to "all six
  languages visible," never to "zero languages visible" — see the comment at the top of
  `site.js` for the reasoning.

---

## Smart links

**`/get/`** — detects the visitor's OS and forwards to the right store, preserving campaign
attribution:

- Campaign token: `/get/?p=<token>` → `ct=<token>` on the App Store, `utm_source=<token>`
  on Google Play.
- **A bare `/get/` defaults to `tiktok-bio`.** That URL predates tokens and is the live
  TikTok bio link — **this default must never change**, or the series loses continuity.
- iOS campaign links need **both** `pt=` and `ct=` to register in App Store Connect →
  Campaigns.
- The Play `referrer` must be encoded exactly once (`utm_source%3D<token>`, never `%253D`).
- TikTok and Meta in-app browsers cannot hand off to the App Store, so those users get
  "Open in browser" instructions instead of a silent redirect.

**`/rate/`** — sends iOS to the App Store `?action=write-review` form and Android to the Play
listing. No tokens: ratings are not source-attributable in either store.

Store identifiers used across the site: Apple **id6757607612** (provider token
`pt=121837520`), Google Play **com.pewpal.app**.

> **`/get/` and `/rate/` must stay single-file, with no `styles.css` link, no self-hosted
> webfont, and no added `<script src="...">`.** Most visitors see these pages for well
> under a second before the redirect fires, but the TikTok/Meta in-app-browser visitors
> above actually read them, so they carry their own small inline `<style>` (system font
> stack only — no `@font-face`) so they still look like Pew Pal without pulling in the
> rest of the site's dependency surface. Any palette or copy edit must stay inside that
> inline `<style>`/inline markup; do not "fix" these pages to `<link rel="stylesheet"
> href="styles.css">` or `<script src="site.js">` — that would tie their load time and
> failure modes to files they don't need. The redirect `<script>` blocks in both files are
> otherwise untouched: same tokens, same query-param handling, same in-app-browser
> detection as before the redesign.

---

## Contact

Support email: **braniapps@gmail.com**

---

## Verifying changes

**The verification harness is NOT part of this repo.** It lives one level up, in a
sibling `verify/` directory alongside a frozen `baseline/` copy of the pre-redesign pages,
so the site itself stays a plain static bundle with nothing but content in it. If you're
picking this project back up, you'll need that harness present locally — it is not
published anywhere.

The harness is a handful of small Python scripts, no dependencies beyond the standard
library:

| Script | What it checks |
|---|---|
| `gate.py text OLD NEW` | Word-for-word fidelity of each language's legal/examen prose (`<section data-lang="en\|pt\|es">` content only — nav/footer chrome is deliberately out of scope, see `chrome` below). Exits 1 and prints a unified diff of whatever changed. |
| `gate.py hrefs OLD NEW` | No outbound link present in the baseline was silently dropped. New links are fine (that's how the redesign added nav/footer cross-links); only *losses* fail. |
| `gate.py cssprose FILE` | No prose (4+ letter word) got smuggled into a CSS `content: "..."` declaration, where neither of the above gates can see it. |
| `gate.py chrome OLD NEW` | The complement of `text`: every distinct word in the baseline's `<nav>`/`<footer>`/`<div class="footer">` region still appears somewhere in the new page's nav/footer. Superset, not equality — the chrome was deliberately enriched with new nav and footer links, so exact-match would fail by design. This is what protects content (like the "Totus Tuus" footer motto) that `text` structurally cannot see — whether it sits outside every `[data-lang]` section (the baseline's shape) or nested inside one as a `<footer>` that `text` deliberately strips before counting words (this repo's shape). |
| `contrast.py` | WCAG contrast ratios for every fixed colour pair used in `styles.css` (light and dark), against the 4.5:1 / 3:1 floors. |

A passing `text`/`hrefs`/`chrome` run always needs two files: the frozen `baseline/*.html`
(what shipped before the redesign) and the current file in this repo. There is currently no
`chrome` baseline snapshot beyond the same `baseline/*.html` files the other gates use — the
same originals work for all four gate modes.

None of the above catches everything. Rendering issues (horizontal overflow at narrow
viewports, whether the language tabs actually work with JS on/off, whether an anchor like
`#espanol` selects the right section on load) need a real browser — those were checked with
Playwright against a local server (`python3 -m http.server --directory .`) rather than a
committed script, since headless-browser tooling doesn't belong in a static site's repo
either.

---

## Editing notes

- No Jekyll config, no dependencies, no CI. Edit the HTML, push to `main`, Pages rebuilds.
- Legal pages state the rights and governing-law clauses per region (Brazil LGPD, Mexico
  LFPDPPP, EU GDPR/RGPD; France: RGPD + loi n° 78-17 « Informatique et Libertés », a
  complaint to the CNIL, and the Code de la consommation; Italy: the GDPR (Regolamento (UE)
  2016/679) + the Codice in materia di protezione dei dati personali (D.Lgs. 196/2003), a complaint
  ("reclamo") to the Garante per la protezione dei dati personali, and the Codice del Consumo
  (D.Lgs. 206/2005); Germany: the DSGVO (Verordnung (EU) 2016/679) + the Bundesdatenschutzgesetz
  (BDSG), the right to complain to a supervisory authority (Art. 77 DSGVO) with the BfDI's page on
  where to lodge it, and the consumer-protection rules of the BGB). Keep the six language sections
  in sync when editing one.
- **Register.** The Italian body text is formal — "Lei", with the courtesy capital (Lei, La, Le,
  Suo/Sua) — as Italian legal and support text is, while the app and its Italian store listing say
  "tu". The one exception is the home page tagline, which is the app's own paywall headline ("Il
  tuo compagno per la Santa Messa"), as the Spanish tagline is informal beside a formal body.
  **German is informal throughout** — „du“, lowercase (dich, dein, ihr), never „Sie“ — the register
  of the app, its German store listing and Apple's and Google's German help pages; the legal pages
  too. Germany-first: ß, „…“ quotes, `z. B.` with a space.
- **No prices in German.** The German sections state no price or currency amount (de serves the
  EUR and CHF storefronts): they name the plans (Pew Pal Jährlich / Pew Pal Monatlich, the de-DE
  store names), their length and the trial, and say the price for the reader's country is shown
  in the app and the store before purchase. Never add an amount to the German.
- **Long German compounds in the legal headings carry a soft hyphen** (`Datenschutz&shy;erklärung`,
  `Nutzungs&shy;bedingungen`, `Gewissens&shy;erforschung`): `.legal-hero h1` never goes below
  2.4rem, and unbroken they are wider than a 320–399px phone, which then scrolls sideways.
- **French, Italian and German are among the app's languages in every section** (owner's decision
  for French, 2026-09-24; Italian followed with 1.11.0, 2026-10-27; German with 1.12.0,
  2026-11-03). The app's languages are listed in four places — `index.html`'s meta description,
  the "Multilingual Support" card, the languages FAQ, and the privacy policy's
  language-preference line — and each language section lists English, Portuguese, Spanish,
  French, Italian and German, its own language first where the section already did so. Adding or removing an app language means
  editing all four places in every section at once; the privacy policy's "Last updated" date
  moves with it, as that page promises. Since 1.9.0 a fifth place names them: the read-aloud FAQ
  ("Does Pew Pal read the prayers aloud?") lists the languages the Little Office is *read in*,
  which follow the bundled recordings, not the UI — a new app language joins that list only once
  its audio ships. Italian's did with 1.11.0 (217 recordings in `OfficiumContent/parvum-audio/it`),
  so the list names five. **German's has not** (German read-aloud audio is not confirmed for
  1.12.0), so every section's read-aloud list still names five, and the German section says the
  Little Office is in German beside the Latin and read aloud in the five: its feature card drops
  "read aloud" („Das Kleine Marianische Offizium“). When German recordings ship, add German to the
  read-aloud FAQ in all six sections and „vorgelesen“ to the German card and answers.
- **The features grid holds nine cards on purpose.** `.grid` never shows more than three columns
  (1024px of content, `minmax(258px, 1fr)`), so nine fill it evenly and a tenth would sit alone on
  its row. In 1.9.0 the read-aloud Little Office took the Breviary card's place rather than
  becoming a tenth card.
- Outbound Apple/Google links are locale-specific — note that Apple's Portuguese privacy
  path is `/br/` for Brazil (`/pt/` is Portugal, and the old `/pt-br/` path 404s). French
  uses `apple.com/fr/legal/privacy/` (served `lang="fr-FR"`; the `legal/privacy/fr-ww/` path
  also resolves but is served as `lang="en-US"`), `support.apple.com/fr-fr/118428` (what
  `HT202039` now redirects to) and `hl=fr` on every Google link. Italian uses
  `apple.com/it/legal/privacy/` (served `lang="it-IT"`; `legal/privacy/it-ww/` 404s),
  `support.apple.com/it-it/118428` and `hl=it` on every Google link. German uses
  `apple.com/de/legal/privacy/` (served `lang="de-DE"`; `legal/privacy/de-ww/` is served
  `lang="en-US"`), `support.apple.com/de-de/118428`, `hl=de` on every Google link, and the BfDI's
  `/DE/Buerger/Inhalte/Allgemein/Datenschutz/BeschwerdeBeiDatenschutzbehoereden.html`.
- **Check outbound links with a GET, not only `curl -I`.** `support.google.com` answers HEAD with
  404 for pages that load fine (GET 200), and the Garante's
  `/modulistica-e-servizi-online/reclamo` answers HEAD 200 but serves an error page; the Italian
  privacy policy links `/diritti/come-agire-per-tutelare-i-tuoi-dati-personali/reclamo` instead.
- The language tabs trim their side padding (`styles.css`, after `.langtabs`): to 7px up to
  1079px, and under 460px to 4px with a 1px gap, 0.08em letter-spacing and a 24px min-width. Six
  tabs at the default 16px are 315px, which wrapped the desktop nav onto two rows up to 996px in
  English and up to 1059px in French (the longest nav labels); at the five-tab 6px they are 195px,
  which dropped below the brand on 355–389px phones (sticky nav 145px → 193px). With these rules
  (207px and 161px), **in every language** the nav is no taller than with five tabs at any width
  from 320px to 1280px (measured 2026-11-03 per language: the labels differ in length, so measure
  each language, not only English). A seventh tab needs measuring again.
- A copy of these pages is mirrored in the Pew Pal app repo under `docs/` for reference.
  **This repo's root is the deploy source** — the mirror is not published.

_All URLs above verified returning HTTP 200 on 2026-07-27. The French section's outbound links
(Apple, Google, CNIL, and the three examen publishers) were verified returning HTTP 200 on
2026-09-24. The Italian section's (Apple, Google, the Garante, and the three examen publishers: the
Penitenzieria Apostolica, Avvenire and the Fathers of Mercy) were verified returning HTTP 200,
with a GET, on 2026-10-27. The German section's (Apple, Google, the BfDI, and the three examen
publishers: the Apostolic Penitentiary's German PDF, the Bistum Regensburg and P. Martin Ramm
FSSP's Beichtspiegel as the Petrus-Canisius-Kreis hosts it) were verified returning HTTP 200, with
both HEAD and GET, on 2026-11-03._
