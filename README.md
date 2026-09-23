# maaadhavq.github.io

Personal portfolio of Madhav K: https://maaadhavq.github.io

Plain HTML and CSS with one small script for the light/dark toggle. There is no framework, no build
step and no web fonts, so the site is fast by default.

## Layout

```
index.html                  home: hero, about, experience, projects, publication, skills, contact
projects/*.html             one case study per project
404.html
assets/css/style.css        all styles (light/dark tokens at the top)
assets/js/theme.js          theme toggle
assets/resume_general.pdf   the resume linked from the site
assets/og.png               social preview image (1200×630)
resume.pdf                  copy of the current resume, so older /resume.pdf links keep working
.github/workflows/pages.yml deploy to GitHub Pages
```

Anything still to be filled in is marked in the page as a yellow `TODO:` badge. Search for
`class="todo"` to find them all.

## Run locally

Use a local server rather than opening the file directly, because the site uses root-relative
paths (`/assets/...`):

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Every push to `main` deploys through GitHub Actions (`.github/workflows/pages.yml`). The workflow
copies the site files into `_site/` and publishes them with `actions/deploy-pages`.

One-time setup: in the repo, go to **Settings → Pages → Build and deployment → Source** and choose
**GitHub Actions**. You can do the same from the CLI:

```bash
gh api -X PUT repos/Maaadhavq/Maaadhavq.github.io/pages -f build_type=workflow
```

To add a new top-level file to the site, add it to the `cp` line in the workflow as well.

## Updating the resume

Replace `assets/resume_general.pdf` and copy the same file to `resume.pdf`.
