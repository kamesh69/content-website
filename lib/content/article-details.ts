import type { ArticleDetail, BlogPost } from "@/lib/types";

export const editorialArticles: ArticleDetail[] = [
  {
    slug: "words-built-for-attention-clarity-and-voice",
    category: "WRITING / CONTENT / STORYTELLING",
    title: "Words built for attention,\nclarity, and voice.",
    author: "Rati Agrawal",
    publishedAt: "September 2026",
    readingTime: "6 min read",
    heroImage: "/images/hero/desk.jpg",
    heroImageAlt:
      "A writer’s desk in warm light, with a hand taking notes beside a coffee mug and notebook",
    introduction:
      "The right words make ideas clearer, stories stronger, and messages more memorable. That’s what I help clients build across scripts, copy, and content.",
    quote: "Good writing does not ask for attention.\nIt earns it.",
    sections: [
      {
        id: "attention",
        heading: "Why attention comes first",
        paragraphs: [
          "We live in a world of constant noise. Every day, people scroll past hundreds of messages. If your words do not stop them, nothing else matters. Attention is the doorway. Without it, even the best idea will never get the chance to land. That’s why the first line, the first sentence, the first few seconds, matter more than most people think.",
        ],
      },
      {
        id: "clarity",
        heading: "Clarity is what makes people stay",
        paragraphs: [
          "Once you have attention, clarity does the heavy lifting. Clear words remove friction. They help people understand faster, feel more confident, and keep reading. I strip away the clutter and focus on what truly matters so your message lands clean and leaves a lasting impression.",
        ],
      },
      {
        id: "voice",
        heading: "Finding the voice behind the words",
        paragraphs: [
          "Every brand has a voice. Some are bold and outspoken. Others are calm and considered. My job is to uncover that voice and shape it into words that feel natural, authentic, and true to you. When the voice is right, your message feels like you, not like everyone else.",
        ],
      },
      {
        id: "people",
        heading: "Writing for people, not algorithms",
        paragraphs: [
          "Trends change. Algorithms change. But people do not. I write for humans, their questions, their desires, their doubts. When you write for people first, everything else follows. The message feels real, relatable, and worth sharing.",
        ],
      },
      {
        id: "effortless",
        heading: "When good copy starts feeling effortless",
        paragraphs: [
          "The best writing does not feel like writing. It feels like a conversation that flows. It guides people, answers their questions, and makes the next step feel natural. That is where good copy shows up, quietly doing its job while helping your business grow.",
        ],
      },
    ],
    closing:
      "Good words are not just about sounding good. They are about making things happen. They build trust, create connection, and turn readers into believers. That is the kind of writing I believe in and the kind I create for my clients every day.",
    seoDescription:
      "The right words make ideas clearer, stories stronger, and messages more memorable. Explore Rati Agrawal’s approach to writing, clarity, voice, and storytelling.",
  },
];

export function getEditorialArticles() {
  return editorialArticles;
}

export function getEditorialArticleBySlug(slug: string) {
  return editorialArticles.find((article) => article.slug === slug) ?? null;
}

export function getEditorialArticleSlugs() {
  return editorialArticles.map((article) => article.slug);
}

export function articleDetailToBlogPost(article: ArticleDetail): BlogPost {
  return {
    id: `editorial-${article.slug}`,
    slug: article.slug,
    title: article.title,
    excerpt: article.introduction,
    content: "",
    publishedAt: article.publishedAt,
    coverImage: article.heroImage,
    author: article.author,
    categories: article.category.split(" / ").map((item) => item.trim()),
  };
}

function estimateReadingTime(...parts: string[]) {
  const text = parts.join(" ").replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function mapBlogPostToArticleDetail(post: BlogPost): ArticleDetail {
  const visibleCategories = post.categories.filter(
    (category) => category.toLowerCase() !== "rati-writing",
  );

  return {
    slug: post.slug,
    category: visibleCategories.join(" / ").toUpperCase() || "WRITING",
    title: post.title,
    author: post.author,
    publishedAt: isIsoDate(post.publishedAt)
      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : post.publishedAt,
    readingTime: estimateReadingTime(post.excerpt, post.content),
    heroImage: post.coverImage ?? "/images/hero/desk.jpg",
    heroImageAlt: post.title,
    introduction: post.excerpt,
    sections: [],
    htmlContent: post.content,
    seoDescription: post.excerpt,
  };
}

function isIsoDate(value: string) {
  return !Number.isNaN(Date.parse(value)) && value.includes("-");
}
