# BISdex

BISdex (Business Information Sources Index) gives librarians quick insights into leading and emerging business information sources. It is maintained by the Business Information Sources Committee, BRASS, RUSA, American Library Association. Contact: bisdex.team@gmail.com.

The site is a static [Astro](https://astro.build/) site hosted on Cloudflare Workers with static assets.

## Requirements

Node 22 (see `.nvmrc`) and npm.

## Commands

```sh
npm install
npm run check      # astro check, ESLint and Prettier
npm run build      # build the site into dist/
npm run preview    # serve dist/ locally
npm run format     # format files with Prettier
```

## Where things live

- `src/config.ts`: site address, review form link, contact email, indexing switch and analytics token.
- `src/pages/`: page routes.
- `public/`: files copied to the site as they are, including `robots.txt`.
- `docs/DESIGN.md`: the design specification.
- `docs/handover/`: editors' original text, kept for reference and never published.
- `wrangler.jsonc`: Cloudflare Workers static assets settings.
