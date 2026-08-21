# WordPress setup for Rati Agrawal (shared CMS)

Use the **existing** Hostinger WordPress at `https://cms.thesportsrivalry.com`.

Do **not** create a second Hostinger site.

## One-time setup in WP Admin

1. Open Hostinger → `cms.thesportsrivalry.com` → **WP Admin**.
2. Confirm **WPGraphQL** is installed and active.
3. Go to **Posts → Categories → Add New**:
   - Name: `Rati Writing`
   - Slug: `rati-writing`
4. Go to **Posts → Add New** (not Articles):
   - Write title + body
   - Set a featured image
   - Assign category **Rati Writing**
   - Publish

## Editorial rule

| Content | WordPress type | Where it appears |
|---------|----------------|------------------|
| Sports | **Articles** (custom CPT) | thesportsrivalry.com |
| Rati portfolio | **Posts** + category `rati-writing` | ratiiagrawal.com |

## Verify GraphQL

```bash
curl -sS -X POST "https://cms.thesportsrivalry.com/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ posts(first: 5, where: { status: PUBLISH, categoryName: \"rati-writing\" }) { nodes { slug title } } }"}'
```

## Vercel env vars

In the Vercel project for this repo (`content-website`):

1. **Settings → Environment Variables** → add for Production (and Preview if you want):

```bash
WORDPRESS_GRAPHQL_URL=https://cms.thesportsrivalry.com/graphql
NEXT_PUBLIC_WORDPRESS_URL=https://cms.thesportsrivalry.com
NEXT_PUBLIC_SITE_URL=https://www.ratiiagrawal.com
```

2. **Redeploy** the latest `main` deployment (Deployments → … → Redeploy), or push a new commit.

3. Confirm:
   - `https://www.ratiiagrawal.com/blog` shows posts (or fallbacks until `rati-writing` has content)
   - After publishing a Post in category `rati-writing`, wait up to ~60s (ISR) and refresh

## Git push

If local `main` is ahead of GitHub, push so Vercel picks up the WordPress integration:

```bash
cd "/Users/kameshkhatri/Desktop/New Website"
git push origin main
```
