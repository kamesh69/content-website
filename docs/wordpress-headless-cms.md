# WordPress headless CMS — full setup

This site uses **WordPress as the CMS** and **Next.js on Vercel as the public website**.

- **CMS (admin only):** `https://cms.thesportsrivalry.com`
- **Live site (public):** `https://www.ratiiagrawal.com`

Editors work in WordPress. Visitors never see WordPress URLs — preview and “View” links open the live site.

---

## 1. Install the WordPress plugin

You have two ways to install it (pick one):

### Option A (recommended): install as a mu-plugin
1. Open Hostinger → `cms.thesportsrivalry.com` → **File Manager** (or SFTP).
2. Go to `wp-content/mu-plugins/` (create the folder if it does not exist).
3. Upload **both** from this repo (or unzip `dist/rati-headless-cms.zip` into `mu-plugins/`):
   ```
   wordpress/rati-headless-cms.php          →  wp-content/mu-plugins/rati-headless-cms.php
   wordpress/rati-headless-cms/             →  wp-content/mu-plugins/rati-headless-cms/
   ```
4. Confirm **WPGraphQL** is installed and active.

### Option B (easier): install via WordPress “Plugins” uploader
1. In WP Admin, go to **Plugins → Add New → Upload Plugin**
2. Upload `dist/rati-headless-cms.zip`
3. Activate the plugin (it should appear as **Rati Headless CMS Loader**)
4. Confirm **WPGraphQL** is installed and active.

Optional helper: `bash scripts/finish-wordpress-setup.sh` (migration + prints secrets).

---

## 2. Configure headless settings in WP Admin

Go to **Rati Site → Headless Settings** and set:

| Field | Value |
|-------|-------|
| Frontend URL | `https://www.ratiiagrawal.com` |
| Preview Secret | Same as `WORDPRESS_PREVIEW_SECRET` in Vercel |
| Revalidate Secret | Same as `REVALIDATE_SECRET` in Vercel |

When you click **Preview** on a post or page, WordPress opens:

```
https://www.ratiiagrawal.com/api/preview?secret=...&slug=...&type=post
```

When you click **View on site** (or visit a public WP URL), you are redirected to the matching page on `ratiiagrawal.com`.

---

## 3. Migrate existing content (one time)

Create a WordPress **Application Password**:

1. WP Admin → **Users → Profile**
2. Scroll to **Application Passwords** → name it `content-migration` → **Add**
3. Copy the generated password

Run locally:

```bash
cd "/Users/kameshkhatri/Desktop/New Website"

export WORDPRESS_REST_USER=your-wp-username
export WORDPRESS_REST_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"
export NEXT_PUBLIC_WORDPRESS_URL=https://cms.thesportsrivalry.com

node scripts/migrate-to-wordpress.mjs
```

This creates:

| WordPress location | Site section |
|--------------------|--------------|
| **Rati Site → Site Content** (JSON) | Homepage copy, nav, hero, about, testimonial, etc. |
| **Services** CPT | `#services` |
| **Projects** CPT | `#work` portfolio grid |
| **FAQ** CPT | `#faq` accordion |
| **Process Steps** CPT | `#process` timeline |
| **Start Here Links** CPT | Start here cards |
| **Pages** `privacy`, `imprint` | `/privacy`, `/imprint` |
| **Posts** in `rati-writing` | `/blog/[slug]` |

---

## 4. Vercel environment variables

In the Vercel project (`content-website`), set:

```bash
WORDPRESS_GRAPHQL_URL=https://cms.thesportsrivalry.com/graphql
NEXT_PUBLIC_WORDPRESS_URL=https://cms.thesportsrivalry.com
NEXT_PUBLIC_SITE_URL=https://www.ratiiagrawal.com
WORDPRESS_PREVIEW_SECRET=<same as WP Headless Settings>
REVALIDATE_SECRET=<same as WP Headless Settings>
```

Optional (for draft preview of unpublished posts):

```bash
WORDPRESS_PREVIEW_AUTH=<base64 of "username:application-password">
```

Redeploy after changing env vars.

---

## 5. What you can edit in WordPress

### Homepage sections

**Rati Site → Site Content** — JSON editor for all homepage copy (hero, about, testimonial, newsletter, navigation, etc.).

After saving, the site revalidates automatically if revalidate secrets match.

### Portfolio, services, FAQ, process

Use the left menu items under **Rati Site**:

- **Services** — title, description, numbered list (JSON array in `service_items` meta), CTA
- **Projects** — featured image, category, type, description, featured flag
- **FAQ** — title = question, content = answer
- **Process Steps** — step number, title, body
- **Start Here Links** — category label, title, link URL

### Blog / writing

**Posts → Add New** (not Articles):

- Assign category **Rati Writing** (`rati-writing`)
- Set featured image
- For structured long-form articles, fill custom fields (visible in REST/GraphQL):
  - `rati_quote`
  - `rati_closing`
  - `rati_reading_time`
  - `rati_hero_image_alt`
  - `rati_sections` — JSON array: `[{"id":"...","heading":"...","paragraphs":["..."]}]`

### Legal pages

**Pages → Privacy** and **Pages → Imprint** — standard WordPress page editor.

---

## 6. Editorial rules (shared CMS)

| Content | WordPress type | Live URL |
|---------|----------------|----------|
| Sports content | **Articles** CPT | thesportsrivalry.com |
| Rati portfolio | **Posts** + `rati-writing` | ratiiagrawal.com/blog/... |
| Rati homepage | **Rati Site Content** + CPTs | ratiiagrawal.com |
| Rati legal | **Pages** | ratiiagrawal.com/privacy, /imprint |

---

## 7. Verify GraphQL

```bash
curl -sS -X POST "https://cms.thesportsrivalry.com/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ ratiSiteSettings ratiServices { nodes { title } } }"}'
```

---

## 8. Instant updates (webhooks)

The mu-plugin calls `POST /api/revalidate` on your Next.js site whenever content is saved. Tags:

| Save action | Revalidated paths |
|-------------|-------------------|
| Post | `/`, `/blog` |
| Page | `/privacy`, `/imprint` |
| Service / Project / FAQ / Process / Start Here | `/` |
| Site settings | `/`, `/blog`, legal pages |

If secrets are not set, the site still updates within ~60 seconds (ISR).

---

## 9. Fallback behavior

If WordPress is unreachable or the plugin is not installed yet, the site falls back to the hardcoded content in `lib/content/*`. Once migration completes and env vars are set, WordPress becomes the source of truth.

---

## 10. Legacy `/articles/` URLs

`/articles/[slug]` redirects to `/blog/[slug]` for backwards compatibility. All writing now lives under `/blog`.
