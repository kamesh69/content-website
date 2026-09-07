import { BlogIndex } from "@/components/blog-index";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllPosts, getSiteSettings } from "@/lib/wordpress";

export const revalidate = 60;

export const metadata = {
  title: "Writing",
  description: "Essays, process notes, and practical thoughts on scripts, copy, and editing.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getAllPosts(), getSiteSettings()]);

  return (
    <>
      <SiteHeader
        variant="editorial"
        contactHref="/#contact"
        site={settings.site}
        editorialNavigation={settings.editorialNavigation}
      />
      <BlogIndex posts={posts} />
      <SiteFooter variant="editorial" site={settings.site} socialLinks={settings.socialLinks} />
    </>
  );
}
