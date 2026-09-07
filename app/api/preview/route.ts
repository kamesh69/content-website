import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { getPostBySlug } from "@/lib/wordpress/posts";

type PreviewSearchParams = {
  secret?: string;
  slug?: string;
  type?: string;
};

function resolvePreviewPath(slug: string, type?: string) {
  if (type === "page") {
    return `/${slug}`;
  }

  return `/blog/${slug}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params: PreviewSearchParams = {
    secret: searchParams.get("secret") ?? undefined,
    slug: searchParams.get("slug") ?? undefined,
    type: searchParams.get("type") ?? undefined,
  };

  const expectedSecret = process.env.WORDPRESS_PREVIEW_SECRET;

  if (!expectedSecret || params.secret !== expectedSecret) {
    return new Response("Invalid preview token.", { status: 401 });
  }

  if (!params.slug) {
    return new Response("Missing slug.", { status: 400 });
  }

  if (params.type === "post" || !params.type) {
    const post = await getPostBySlug(params.slug, true);
    if (!post) {
      return new Response("Preview content not found.", { status: 404 });
    }
  }

  const draft = await draftMode();
  draft.enable();

  redirect(resolvePreviewPath(params.slug, params.type));
}
