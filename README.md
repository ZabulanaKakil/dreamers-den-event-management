# Dreamers Den — Event Management

Event Management sub-site for Dreamers Den — static HTML, CSS, and light JavaScript (no build step required).

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Landing page (entry from main Dreamers Den site) |
| `about.html` | About us and milestones |
| `services.html` | Our services (10 cards) |
| `partners.html` | Partner showcase |
| `contact.html` | Contact details + Google Form |

## Quick start (local preview)

Open `index.html` in a browser, or serve the folder:

```powershell
cd "E:\Projects\Cursor AI\Dreamers Den\Event Management"
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Configuration

Edit **[js/config.js](js/config.js)** for most content changes:

- `mainSiteUrl` — link back to main Dreamers Den website
- `googleFormUrl` / `googleFormEmbedUrl` — inquiry form
- `contact` — email, phone, address, hours, social links
- `services` — service names, descriptions, images
- `partners` — partner names, categories, logo paths
- `milestones` — About page timeline

## Replace assets

| Asset | Location |
|-------|----------|
| Logo | `assets/images/logo.png` (from `Artboard1.png`) |
| Service images | `assets/images/services/*.svg` or your own JPG/PNG |
| Partner logos | `assets/images/partners/` + update `image` in config |

## GitHub Pages

1. Push this repository to GitHub.
2. On GitHub: **Settings → Pages → Build and deployment**
3. Source: **Deploy from a branch** → `main` → `/ (root)`
4. Save. Site will be at `https://zabulanakakil.github.io/dreamers-den-event-management/`
5. Link from your main Dreamers Den site to that URL.

Optional: add a `.nojekyll` file (already included) if you use paths GitHub might mis-process.

## Project notes

Use **[NOTES.md](NOTES.md)** to record your own changes, content updates, and decisions over time.

## File structure

```
├── index.html, about.html, services.html, partners.html, contact.html
├── css/          variables, base, components, pages
├── js/           config.js, main.js
├── assets/images/
├── README.md     (this file — setup & deploy)
├── NOTES.md      (your change log — blank to start)
└── .nojekyll
```
