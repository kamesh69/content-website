# Rati Agrawal — Writer & Editor

Premium editorial portfolio built with Next.js. The homepage is code-managed; writing is pulled from the shared Hostinger WordPress at `cms.thesportsrivalry.com` via WPGraphQL (standard **Posts** in category `rati-writing`).

## Stack

- Next.js 15
- React 19
- TypeScript
- SCSS Modules
- WordPress via WPGraphQL (shared CMS with the sports site)

## Development

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Environment

```bash
NEXT_PUBLIC_SITE_URL=https://www.ratiiagrawal.com
NEXT_PUBLIC_WORDPRESS_URL=https://cms.thesportsrivalry.com
WORDPRESS_GRAPHQL_URL=https://cms.thesportsrivalry.com/graphql
NEWSLETTER_URL=https://newsletter.example.com
```

Set the same values in the Vercel project → Settings → Environment Variables, then redeploy.

## WordPress (shared CMS)

See [docs/wordpress-shared-cms.md](docs/wordpress-shared-cms.md).

- Sports content → WordPress **Articles**
- Rati writing → WordPress **Posts** + category **`rati-writing`**

## Content

Homepage marketing copy lives in `lib/content/`. Latest writing on the homepage and `/blog` prefer live WordPress posts, with static fallbacks when the CMS is empty or unreachable.
