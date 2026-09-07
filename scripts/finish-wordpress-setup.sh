#!/usr/bin/env bash
# Interactive helper for remaining WordPress + Vercel setup steps.
# Usage: bash scripts/finish-wordpress-setup.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== Rati headless CMS — finish setup ==="
echo
echo "This script cannot upload to Hostinger for you, but it will:"
echo "  1) Confirm the plugin zip exists"
echo "  2) Run the content migration (needs WP Application Password)"
echo "  3) Print the exact Vercel env vars to paste"
echo

PLUGIN_ZIP="$ROOT/dist/rati-headless-cms.zip"
if [[ ! -f "$PLUGIN_ZIP" ]]; then
  mkdir -p dist
  (cd wordpress && zip -r ../dist/rati-headless-cms.zip rati-headless-cms.php rati-headless-cms)
fi
echo "✓ Plugin zip: $PLUGIN_ZIP"
echo "  Upload BOTH of these into Hostinger File Manager → wp-content/mu-plugins/:"
echo "    - rati-headless-cms.php          (loader)"
echo "    - rati-headless-cms/             (folder)"
echo "  Or unzip $PLUGIN_ZIP into wp-content/mu-plugins/"
echo

if [[ -f .env.local ]]; then
  # shellcheck disable=SC1091
  set -a
  source .env.local
  set +a
fi

PREVIEW_SECRET="${WORDPRESS_PREVIEW_SECRET:-}"
REVALIDATE_SECRET="${REVALIDATE_SECRET:-}"

if [[ -z "$PREVIEW_SECRET" || -z "$REVALIDATE_SECRET" ]]; then
  PREVIEW_SECRET="$(openssl rand -hex 32)"
  REVALIDATE_SECRET="$(openssl rand -hex 32)"
  echo "Generated new secrets (also add these to .env.local / Vercel)."
fi

echo "=== WordPress Headless Settings (Rati Site → Headless Settings) ==="
echo "Frontend URL:      https://www.ratiiagrawal.com"
echo "Preview Secret:    $PREVIEW_SECRET"
echo "Revalidate Secret: $REVALIDATE_SECRET"
echo

echo "=== Vercel env vars (Project → Settings → Environment Variables) ==="
cat <<EOF
WORDPRESS_GRAPHQL_URL=https://cms.thesportsrivalry.com/graphql
NEXT_PUBLIC_WORDPRESS_URL=https://cms.thesportsrivalry.com
NEXT_PUBLIC_SITE_URL=https://www.ratiiagrawal.com
WORDPRESS_PREVIEW_SECRET=$PREVIEW_SECRET
REVALIDATE_SECRET=$REVALIDATE_SECRET
EOF
echo

read -r -p "Have you installed the mu-plugin on Hostinger? [y/N] " installed
if [[ "${installed:-}" != "y" && "${installed:-}" != "Y" ]]; then
  echo "Install the plugin first, then re-run this script."
  exit 0
fi

read -r -p "WordPress username: " WP_USER
read -r -s -p "Application Password (from Users → Profile): " WP_PASS
echo

export WORDPRESS_REST_USER="$WP_USER"
export WORDPRESS_REST_PASSWORD="$WP_PASS"
export NEXT_PUBLIC_WORDPRESS_URL="${NEXT_PUBLIC_WORDPRESS_URL:-https://cms.thesportsrivalry.com}"

echo "Running migration..."
node scripts/migrate-to-wordpress.mjs

echo
echo "=== Final checks ==="
echo "1. WP Admin → Rati Site → Headless Settings → paste secrets above → Save"
echo "2. Vercel → add env vars above → Redeploy"
echo "3. Publish a test Post in category rati-writing → Preview should open ratiiagrawal.com"
echo "Done."
