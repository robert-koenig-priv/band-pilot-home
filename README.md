# BandPilot — product & help site

A static marketing + documentation site for **BandPilot**, the band-collaboration app.
Every band member carries the app on their phone; the **band admin** runs the system (a web app,
recommended for admins, lives at [app.bandpilot.net](https://app.bandpilot.net)).

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Landing page — hero, the two collaboration roles, feature overview, platforms |
| `songs.html` | Songs feature guide — views, song details, status pipeline, grouping, flags, voting/veto, media & practice |
| `rehearsals.html` | Rehearsals feature guide — building setlists, absent members, email updates |
| `getting-started.html` | Onboarding help — account, bands, navigation, roles, the web app |

## Structure

```
.
├─ index.html  songs.html  rehearsals.html  getting-started.html
├─ assets/
│  ├─ css/site.css      # all styling (design tokens, layout, the song-row signature)
│  ├─ js/site.js        # mobile menu + scroll reveal (progressive enhancement)
│  └─ img/              # curated app screenshots + favicon.svg
├─ screens/             # original source screenshots (not referenced by the site)
├─ .nojekyll            # serve assets untouched on GitHub Pages
└─ README.md
```

Pure static HTML/CSS/JS — no build step. Fonts (Anton, Manrope, Space Mono) load from Google Fonts.

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy (GitHub Pages)

Push this folder as a repo, then in **Settings → Pages** set the source to the `main` branch,
`/ (root)`. The site is served as-is (`.nojekyll` disables Jekyll processing).

## Translations (English / Deutsch / Français / ქართული)

The site is multilingual with **no build step**. English is authored inline in the HTML and is the
fallback; German, French and Georgian live in one file. It auto-detects the visitor's browser
language, offers a 🌐 switcher in the header, and remembers a manual choice in `localStorage`.

> **Georgian fonts:** the primary faces (Anton/Manrope/Space Mono) have no Georgian glyphs, so
> **Noto Sans Georgian** is loaded and added as a per-glyph fallback in the `--font-*` variables.
> Thanks to Google Fonts' `unicode-range`, it downloads **only** when Georgian text is actually shown,
> so non-Georgian visitors pay nothing.

- `assets/js/i18n.js` — the engine (detect → apply → wire the switcher). Loaded as a plain script.
- `assets/i18n/translations.js` — `window.BP_TRANSLATIONS = { de: {…}, fr: {…} }`.
- Each translatable element carries a key: `data-i18n` (inner HTML), `data-i18n-alt`,
  `data-i18n-content` (meta description), or `data-i18n-aria-label`.
- A tiny inline script in each page's `<head>` picks the language early and hides the body only for
  non-English visitors (via `.i18n-pending`) so there's no flash.

**Add a string:** put `data-i18n="ns.key"` on the element (English stays as its content), then add
`"ns.key": "…"` to both `de` and `fr` in `translations.js`.

**Add a language:** extend `SUPPORTED`/`LABELS` in `i18n.js` and the `SUP` list in each page's head
script, add a dictionary in `translations.js`, and add a `<button data-lang="xx">` to the header
switcher and the mobile `.langrow` on every page.

**Check coverage** (keys used in HTML vs. keys defined in each dictionary):
```bash
node -e 'var fs=require("fs"),w={};new Function("window",fs.readFileSync("assets/i18n/translations.js","utf8"))(w);
var used=[...new Set(require("child_process").execSync("grep -ohE \"data-i18n(-alt|-content|-aria-label)?=\\\"[^\\\"]+\\\"\" *.html").toString().match(/="([^"]+)"/g).map(s=>s.slice(2,-1)))];
["de","fr"].forEach(l=>{var d=w.BP_TRANSLATIONS[l];console.log(l,"missing:",used.filter(k=>!(k in d)));});'
```
Left untranslated on purpose: the brand slogan "Manage · Organize · Rock", the wordmark,
`app.bandpilot.net`, and in-app data literals (song titles, keys like `Dm → Cm`, BPM, the sample date).

> The DE/FR copy was machine-drafted — a native-speaker proofread is recommended, German first.

## Notes

- The login and side-menu screens are **recreated in HTML** rather than embedded from the source
  screenshots, which contained a personal email address. All other imagery is real app screenshots.
- Mobile app buttons are shown as "coming soon"; the primary call to action is the web app.
