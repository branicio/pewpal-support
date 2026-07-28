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
| Examination of Conscience | https://branicio.github.io/pewpal-support/examen.html | Trilingual examen, linked from the home page |
| App icon | https://branicio.github.io/pewpal-support/app-icon.png | Shared asset |

`/get/` and `/rate/` are directories containing `index.html` — the trailing slash is the
canonical form.

---

## Files

| Path | Purpose |
|---|---|
| `index.html` | Home page — trilingual landing page (English → Português → Español stacked sections) |
| `privacy.html` | Privacy Policy, same trilingual structure |
| `terms.html` | Terms of Use, same trilingual structure |
| `examen.html` | Examination of Conscience — trilingual, links out to external publishers only |
| `styles.css` | The one stylesheet for all four content pages: design tokens (colour, type, spacing), card/nav/footer components, the `[data-lang]` show/hide rules and their no-JS fallback, and the `[data-rise]` load-in animation (disabled under `prefers-reduced-motion`) |
| `site.js` | Language-tab controller — see "Languages and anchors" below. No other behaviour lives here; the smart-link pages (`get/`, `rate/`) intentionally have their own separate inline scripts, not this file |
| `fonts/` | Three self-hosted `.woff2` files (EB Garamond roman + italic, Inter) — see "Self-hosted fonts" below |
| `badges/` | Six vendored App Store / Google Play badge images — see "Vendored store badges" below |
| `OFL.txt` | The SIL Open Font License covering the `fonts/` files — required attribution for both EB Garamond and Inter |
| `app-icon.png` | Shared app-icon asset used as the favicon and the nav/footer brand mark on every page |
| `get/index.html`, `rate/index.html` | Single-file smart-link interstitials — see "Smart links" below |

---

## Vendored store badges (`badges/`)

The site loads **no third-party subresource anywhere** — fonts, the app icon and the six
App Store / Google Play badges are all served from this repo. The badges are Apple's and
Google's own artwork, downloaded byte-for-byte from:

| File | Source |
|---|---|
| `badges/app-store-en-us.svg` | `https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83` |
| `badges/app-store-pt-br.svg` | …same with `/pt-br` |
| `badges/app-store-es-mx.svg` | …same with `/es-mx` |
| `badges/google-play-en-us.png` | `https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png` |
| `badges/google-play-pt-br.png` | …same with `intl/pt-BR` + `pt-br_badge_web_generic.png` |
| `badges/google-play-es.png` | …same with `intl/es` + `es_badge_web_generic.png` |

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
zero coverage for this site's English/Portuguese/Spanish content, so it was dropped to keep
the payload small (3 files, ~117 KB total, down from an initial 14-file/951 KB pass).

Self-hosting, same as the badges above, means **zero third-party requests of any kind** —
no Google Fonts DNS/TLS round trip, no dependency on a CDN staying up, and no way for a
third party to see a visitor's IP or User-Agent just from loading this site. This matters
more here than it would for an ordinary marketing site: this is the privacy policy for an
app whose entire pitch is "we make zero network calls," so the page that hosts that promise
has to keep it too.

---

## Languages and anchors

`privacy.html`, `terms.html` and `examen.html` are **single stacked trilingual pages**
(English → Português → Español), each with the same three anchors:

| Anchor | Language |
|---|---|
| `#top` | English |
| `#portugues` | Português (pt-BR) |
| `#espanol` | Español |

Example: https://branicio.github.io/pewpal-support/privacy.html#espanol

> **Store listings deliberately use the BASE URLs above for all four locales**
> (en-US, pt-BR, es-MX, es-ES) — **no `#anchor` deep-links.** This keeps the locales
> consistent, and the Terms link lives inside the App Store description, which cannot be
> changed without a new version and a review cycle. If anchor deep-linking is ever adopted,
> do it for every locale at once, as a planned release change and not a hotfix.

### How the language tabs work (`site.js`)

`index.html`, `privacy.html`, `terms.html` and `examen.html` each render all three
languages as sibling `<section data-lang="en|pt|es">` elements. `site.js` is what turns
that into a tabbed view:

- On load it reads `location.hash` (`#top` → en, `#portugues` → pt, `#espanol` → es); if
  the hash is empty or unrecognised it falls back to `navigator.language`, then to English.
- Clicking a language tab (`role="tab"`, `EN`/`PT`/`ES` in the nav) shows that language's
  section, hides the other two (`data-lang-active` + `aria-hidden`), sets
  `document.documentElement.lang`, and updates `location.hash` via `history.replaceState`
  (so the URL becomes shareable without adding a back-button entry per click).
- Left/Right arrow keys move focus and selection between tabs, standard ARIA tablist
  behaviour.
- Navigating directly to `#portugues` or `#espanol` (or reloading on one) selects that
  language on load — this is exactly what the anchor deep-links above rely on.

**No-JS fallback.** `site.js` only sets `document.documentElement.dataset.js = "on"` as its
very first statement, and only `styles.css` rules scoped under `html[data-js="on"]` hide the
inactive `[data-lang]` sections. That means:
- With JavaScript disabled entirely, `data-js` is never set, the CSS hiding rule never
  matches, and all three languages render stacked on one page, top to bottom — still fully
  readable, still fully linkable via `#top`/`#portugues`/`#espanol` (the browser's native
  in-page anchor scroll works with zero script). This is the safety net for a JS-less
  visitor or an App Store reviewer.
- If `site.js` throws partway through setup, its `catch` block explicitly *removes*
  `data-js` again and logs to `console.error` — it never rethrows — which hands control
  back to the same no-JS stylesheet branch. So a script error degrades to "all three
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
  LFPDPPP, EU GDPR/RGPD). Keep the three language sections in sync when editing one.
- Outbound Apple/Google links are locale-specific — note that Apple's Portuguese privacy
  path is `/br/` for Brazil (`/pt/` is Portugal, and the old `/pt-br/` path 404s).
- A copy of these pages is mirrored in the Pew Pal app repo under `docs/` for reference.
  **This repo's root is the deploy source** — the mirror is not published.

_All URLs above verified returning HTTP 200 on 2026-07-27._
