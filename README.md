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

## Notes

- The login and side-menu screens are **recreated in HTML** rather than embedded from the source
  screenshots, which contained a personal email address. All other imagery is real app screenshots.
- Mobile app buttons are shown as "coming soon"; the primary call to action is the web app.
