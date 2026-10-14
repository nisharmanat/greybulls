# Grey Bulls website
Static homepage for greybulls.com, hosted on Cloudflare Pages.

## Structure
- index.html: page layout
- assets/js/data.js: all content (team info, squad, honours, gallery). Edit this to update the site.
- assets/js/main.js: hero slider, squad filters, gallery carousel, lightbox
- assets/css/style.css: styles (navy and gold theme)
- assets/img/: photos. Each photo has a large version (name.jpg, max 1800px) and a small one (name-sm.jpg, max 820px).

## Common edits
- Add a player: add a line to `squad` in data.js.
- Give a player a photo: save a square crop as `assets/img/<name>-sm.jpg` and set `photo: "<name>"` on the player.
- Add a gallery photo: save `<name>.jpg` and `<name>-sm.jpg` in assets/img and add `{img: "<name>", alt: "..."}` to `gallery`.

## Deploy
Cloudflare dashboard, Workers & Pages, open the project, Create new deployment, upload the zip of this folder (index.html at the top level of the zip).

## Next steps
- Move to Astro with the same data shape (data.js becomes JSON content files) and connect a GitHub repo for automatic deploys.
- Later: Cloudflare D1 + Workers for stats with a small admin page, R2 for a larger photo library.
