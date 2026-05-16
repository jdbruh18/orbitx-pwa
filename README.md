# OrbitX

OrbitX is a static frontend for a futuristic, responsive, progressive web experience. This repository contains the production-ready HTML/CSS/JS and PWA assets — no build configuration is included by default.

Status: static site (open and serve as-is). To add a modern dev/build workflow, see the "Optional: add a build" section below.

## Quick start — run the site locally

Option A — open directly
- Open [index.html](index.html) in your browser (suitable for quick local testing).

Option B — simple local HTTP server (recommended)
- Using Python 3 (works on macOS/Windows/Linux):

```bash
# from repository root
python -m http.server 5173
# then open http://localhost:5173
```

- Using Node (no install required):

```bash
npx http-server -c-1 . -p 5173
# then open http://localhost:5173
```

- Using VS Code: install the Live Server extension and click "Go Live".

## What’s included in this repo

- Pages: [index.html](index.html), [about.html](about.html), [dashboard.html](dashboard.html), [launch.html](launch.html), [lunar.html](lunar.html), [satellites.html](satellites.html), [telemetry.html](telemetry.html)
- PWA: [manifest.json](manifest.json), [sw.js](sw.js)
- Styles: [css/style.css](css/style.css), [css/responsive.css](css/responsive.css)
- Scripts: [js/app.js](js/app.js), [js/dashboard.js](js/dashboard.js), [js/launch.js](js/launch.js), [js/layout.js](js/layout.js), [js/telemetry.js](js/telemetry.js)
- Images: see the `images/` directory for assets

If a `package.json`, `vite.config.*`, or other tooling files appear later, follow their README or scripts. Currently there are no npm scripts in this repository.

## Progressive Web App notes

- The repository includes a web app manifest and a service worker (`sw.js`). When served over HTTP(S) from a local server, the PWA features (installability, offline caching) will function.

## Optional: add a build/dev workflow (minimal)

If you want hot reload, bundling, and production builds, add a simple Vite-based workflow:

```bash
# initialize npm and install Vite
npm init -y
npm install -D vite

# then add these scripts to package.json:
# "dev": "vite", "build": "vite build", "preview": "vite preview"
```

Notes:
- You may need to move HTML/CSS/JS into a `src/` layout or adapt `index.html` paths for Vite. The minimal steps above get you a working dev server quickly.

## Contributing

- Fork, create a branch, and open a pull request. For small edits (content, styles, assets) you can edit directly and preview locally.

## License

This repository does not include a LICENSE file by default. If you want to apply the Apache-2.0 license shown previously, add a `LICENSE` file at the repository root.

## Contact

Open an issue or pull request in this repository for questions or contributions.

---
This README was updated to reflect the repository's current static-site layout and to provide minimal, actionable instructions for running locally or adding a build step.
