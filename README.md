# Rati Agrawal — Writer & Editor

Premium editorial portfolio built with Next.js. The homepage is a code-managed writer/editor experience; the `/blog` section remains wired for headless WordPress via WPGraphQL.

## Stack

- Next.js 15
- React 19
- TypeScript
- SCSS Modules
- WordPress via WPGraphQL (optional)

## Development

```bash
npm install
npm run dev
```

## Environment

Create `.env.local` with:

```bash
NEXT_PUBLIC_SITE_URL=https://example.com
WORDPRESS_GRAPHQL_URL=https://cms.example.com/graphql
WORDPRESS_PREVIEW_SECRET=change-me
NEWSLETTER_URL=https://newsletter.example.com
```

## Content

Homepage copy and media live in `lib/content/`:

- `site.ts` — brand, hero, about, newsletter, etc.
- `services.ts`
- `projects.ts`
- `articles.ts`
- `faq.ts`
- `process.ts`

## Production on Hostinger VPS

1. Deploy the code to the Node.js site path managed by CloudPanel.
2. Install dependencies and build the project.
3. Start the app with PM2 using `ecosystem.config.cjs`.
4. Point the reverse proxy to port `3000`.
5. Run WordPress separately on `cms.<domain>` and install `WPGraphQL`.
