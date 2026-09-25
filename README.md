# maaadhavq.github.io

Personal portfolio of Madhav K, AI developer in Chennai: **https://maaadhavq.github.io**

Plain HTML, CSS and vanilla JavaScript. No framework and no build step.

## What's on it

- **Intro.** Who I am, the roles I'm looking for, and links to my resume, LinkedIn, GitHub and email.
  The headline's last word cycles through things I've shipped: products, copilots, dashboards, pipelines.
- **Selected work.** A grid of real screenshots of each project running. Hover a tile to scroll through
  the screenshot. Click one for a quick look (problem, what I built, result, product decision), with a
  link to the full case study.
- **Things I believe.** Four principles from building these projects, each linked to the project it
  came from.
- **Experience, skills and contact.**
- **Case studies** (`projects/*.html`): problem, users, constraints, what I built, metrics,
  trade-offs and what I'd do next. The Mandate Retry case study includes a canvas replay of that
  project's committed run: each of the 500 dots is a real record from its ledger.

## Design

- **Colour.** Sage-tinted neutrals (`#eff1ec`), forest ink (`#15201a`, links `#1f6b45`) and a
  turmeric accent (`#e9a91c`), split roughly 60 / 30 / 10. Dark mode uses a deep forest background
  (`#0e1511`). Every text colour passes WCAG AA in both themes.
- **Type.** Bricolage Grotesque for headings, Atkinson Hyperlegible Next for body text, and
  Martian Mono for dates and data. All from Google Fonts.
- **Motion.** Word-by-word headline reveal, a cycling headline word, scroll-on-hover screenshots, a
  cursor label over project tiles, magnetic buttons, a scroll progress line, beliefs that light up
  as they scroll into view, and a highlight that follows the nav. All motion switches off for
  visitors who ask for reduced motion, and the page works without JavaScript.

## Layout

```
index.html                  home page
projects/*.html             one case study per project
404.html
assets/css/style.css        all styles (light/dark colour tokens at the top)
assets/js/theme.js          light/dark toggle
assets/js/site.js           nav highlight, quick-look panels, headline cycle, cursor label,
                            magnetic buttons, reveals, copy-email toast, Chennai clock
assets/js/pipeline.js       Mandate Retry replay (canvas), 500-record data inline
assets/img/                 full-page project screenshots (WebP, 640 and 1280 wide)
assets/resume_general.pdf   the resume linked from the site
assets/og.png               social preview image (1200×630)
assets/favicon.svg
resume.pdf                  copy of the current resume, so older /resume.pdf links keep working
.github/workflows/pages.yml deploy to GitHub Pages
```

## Run locally

Use a local server rather than opening the file directly, because the site uses root-relative
paths (`/assets/...`):

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Every push to `main` deploys through GitHub Actions (`.github/workflows/pages.yml`). The workflow
copies the site files into `_site/` and publishes them with `actions/deploy-pages`. To add a new
top-level file to the site, add it to the `cp` line in the workflow as well.

CSS and JS links carry a version query (`style.css?v=1a2b3c4d`, from a hash of the file). When you
edit one of those files, update its `?v=` value in every HTML page, or visitors may keep seeing the
cached old version for up to 10 minutes.

## Updating the resume

Replace `assets/resume_general.pdf` and copy the same file to `resume.pdf`.
