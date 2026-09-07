import { revalidatePath, revalidateTag } from "next/cache";

type RevalidateBody = {
  tag?: string;
  paths?: string[];
};

const TAG_PATHS: Record<string, string[]> = {
  posts: ["/", "/blog"],
  pages: ["/privacy", "/imprint"],
  services: ["/"],
  projects: ["/"],
  faq: ["/"],
  process: ["/"],
  "start-here": ["/"],
  "site-settings": ["/", "/privacy", "/imprint", "/blog"],
};

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return Response.json({ ok: false, message: "Invalid secret." }, { status: 401 });
  }

  let body: RevalidateBody = {};

  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    body = {};
  }

  const tag = body.tag ?? "site-settings";
  revalidateTag(tag);

  const paths = body.paths?.length ? body.paths : (TAG_PATHS[tag] ?? ["/"]);

  for (const path of paths) {
    revalidatePath(path);
  }

  return Response.json({ ok: true, tag, paths });
}
