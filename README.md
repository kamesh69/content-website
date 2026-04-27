# Portfolio Frontend

Custom animated Next.js portfolio frontend intended to run alongside a WordPress CMS on the same Hostinger VPS.

## Stack

- Next.js 15
- React 19
- TypeScript
- SCSS Modules
- GSAP / ScrollTrigger
- Pixi.js
- Three.js / React Three Fiber
- WordPress via WPGraphQL

## Environment

Create `.env.local` with:

```bash
NEXT_PUBLIC_SITE_URL=https://example.com
WORDPRESS_GRAPHQL_URL=https://cms.example.com/graphql
WORDPRESS_PREVIEW_SECRET=change-me
NEWSLETTER_URL=https://newsletter.example.com
```

## Development

```bash
npm install
npm run dev
```

## Production on Hostinger VPS

1. Deploy the code to the Node.js site path managed by CloudPanel.
2. Install dependencies and build the project.
3. Start the app with PM2 using `ecosystem.config.cjs`.
4. Point the reverse proxy to port `3000`.
5. Run WordPress separately on `cms.<domain>` and install `WPGraphQL`.
