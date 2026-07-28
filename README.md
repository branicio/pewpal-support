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

---

## Smart links

**`/get/`** — detects the visitor's OS and forwards to the right store, preserving campaign
attribution:

- Campaign token: `/get/?p=<token>` → `ct=<token>` on the App Store, `utm_source=<token>`
  on Google Play.
- **A bare `/get/` defaults to `tiktok-bio`.** That URL predates tokens and is the live
  TikTok bio link — do not change the default, or the series loses continuity.
- iOS campaign links need **both** `pt=` and `ct=` to register in App Store Connect →
  Campaigns.
- The Play `referrer` must be encoded exactly once (`utm_source%3D<token>`, never `%253D`).
- TikTok and Meta in-app browsers cannot hand off to the App Store, so those users get
  "Open in browser" instructions instead of a silent redirect.

**`/rate/`** — sends iOS to the App Store `?action=write-review` form and Android to the Play
listing. No tokens: ratings are not source-attributable in either store.

Store identifiers used across the site: Apple **id6757607612** (provider token
`pt=121837520`), Google Play **com.pewpal.app**.

---

## Contact

Support email: **braniapps@gmail.com**

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
