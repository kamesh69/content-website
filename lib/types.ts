export type NavItem = {
  label: string;
  href: string;
};

export type Service = {
  id: string;
  number: string;
  title: string;
  description: string;
  items: string[];
  cta: string;
  href: string;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  type: string;
  description?: string;
  image: string;
  href: string;
  featured?: boolean;
};

export type Article = {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
  excerpt?: string;
};

export type StartHereItem = {
  id: string;
  category: string;
  title: string;
  href: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  body: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  coverImage?: string;
  author: string;
  categories: string[];
};
