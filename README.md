# Patrick Stone Ventures static website

A lightweight, framework-free website built with HTML5, CSS3 and vanilla JavaScript.

## Preview locally

Open `index.html` directly, or serve the folder with any static HTTP server.

## Main files

- `index.html` — homepage
- `assets/css/style.css` — design system and component styles
- `assets/css/responsive.css` — responsive layouts
- `assets/js/main.js` — navigation, modal, filters, FAQs and reveal behaviour
- `tools/build-pages.mjs` — build-time generator for the inner HTML pages
- `tools/faq-content.mjs` — approved FAQ content used across relevant pages

The generated pages are committed as ordinary HTML files and do not require Node.js on the hosting server. Run the following only after editing the shared inner-page template or product data:

```sh
node tools/build-pages.mjs
```

## Form connection

Quote and contact forms create a pre-filled WhatsApp message for `+234 816 752 5393`. The visitor reviews the generated message in WhatsApp and taps Send. The integration is handled in `assets/js/main.js` and does not require a server-side form endpoint.

## Deployment

Upload only the root HTML files, `assets` folder, `robots.txt` and `sitemap.xml` to the web root of standard shared hosting. The site has no runtime build process or database dependency.

Do not upload `Context`, `Old_bkup`, `tools`, `context.md`, `.DS_Store` or this README. `Context` contains source material supplied for development and is intentionally excluded from production.
# patrickstoneventures
