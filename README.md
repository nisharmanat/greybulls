# Grey Bulls website
Static homepage for greybulls.com, hosted on Cloudflare Workers (static assets).

## Structure
- public/: everything served on the site
- public/index.html: page layout
- public/assets/js/data.js: all content (team info, squad, honours, gallery). Edit this to update the site.
- public/assets/js/main.js: hero slider, squad filters, gallery carousel, lightbox
- public/assets/css/style.css: styles (navy and gold theme)
- public/assets/img/: photos. Each photo has a large version (name.jpg, max 1800px) and a small one (name-sm.jpg, max 820px).

## Common edits
- Add a player: add a line to `squad` in data.js.
- Give a player a photo: save a square crop as `public/assets/img/<name>-sm.jpg` and set `photo: "<name>"` on the player.
- Add a gallery photo: save `<name>.jpg` and `<name>-sm.jpg` in public/assets/img and add `{img: "<name>", alt: "..."}` to `gallery`.

## Deploy
The repo is connected to the `grey-bulls` Worker on Cloudflare. Every push to `main` deploys automatically (deploy command `npx wrangler deploy`, configured in wrangler.jsonc).

## Next steps
- Move to Astro with the same data shape (data.js becomes JSON content files).
- Later: Cloudflare D1 + Workers for stats with a small admin page, R2 for a larger photo library.
