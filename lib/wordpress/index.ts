import { getFaqItems } from "./faq";
import { getPageBySlug } from "./pages";
import { getProcessSteps } from "./process";
import { getProjects } from "./projects";
import { getAllPosts, getLatestArticles, getLatestPosts, getPostBySlug } from "./posts";
import { getServices } from "./services";
import { getSiteSettings } from "./site-settings";
import { getStartHereItems } from "./start-here";

export type HomepageContent = Awaited<ReturnType<typeof getHomepageContent>>;

export async function getHomepageContent() {
  const [settings, services, projects, faqItems, processSteps, startHereItems, latestArticles] =
    await Promise.all([
      getSiteSettings(),
      getServices(),
      getProjects(),
      getFaqItems(),
      getProcessSteps(),
      getStartHereItems(),
      getLatestArticles(5),
    ]);

  return {
    ...settings,
    services,
    projects,
    faqItems,
    processSteps,
    startHereItems,
    latestArticles,
  };
}

export {
  getAllPosts,
  getFaqItems,
  getLatestArticles,
  getLatestPosts,
  getPageBySlug,
  getPostBySlug,
  getProcessSteps,
  getProjects,
  getServices,
  getSiteSettings,
  getStartHereItems,
};

export { RATI_CATEGORY_SLUG } from "./client";
export { mapBlogPostToArticle, mapBlogPostToArticleDetail, mapWpPostToUiPost } from "./posts";
