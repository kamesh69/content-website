export type SectionNavItem = {
  label: string;
  href: string;
};

export type HeroContent = {
  eyebrow: string;
  topCopy: string;
  bottomCopy: string;
  titleTop: string;
  titleBottom: string;
  titleAccent: string;
  centerCaption: string;
  sideMonogram: string;
  logoWallLabel: string;
  supportingText: string;
  commandments: string[];
  metrics: string[];
  backgroundImage: string;
  floatingCardTitle: string;
  floatingCardBody: string;
};

export type Project = {
  id: string;
  title: string;
  year: string;
  services: string[];
  summary: string;
  link: string;
  coverImage: string;
  tvVideo: string;
  gallery: string[];
};

export type AboutContent = {
  eyebrow: string;
  heading: string;
  intro: string;
  body: string[];
  quote: string;
  collage: string[];
  heroImage: string;
  manifesto: string[];
  practice: string[];
  stats: Array<{
    label: string;
    values: string[];
  }>;
  sections: Array<{
    number: string;
    title: string;
    body: string;
  }>;
};

export type ProcessStep = {
  number: string;
  title: string;
  body: string;
  image: string;
};

export type NewsletterLink = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

export type FaqItem = {
  question: string;
  answer: string;
  askedBy: string;
};

export type ContactBlock = {
  eyebrow: string;
  heading: string;
  body: string;
  email: string;
  details: string[];
  finishStrongTitle: string;
  finishStrongBody: string;
  socialLinks: Array<{
    label: string;
    href: string;
  }>;
  legalLinks: Array<{
    label: string;
    href: string;
  }>;
  studioLinks: Array<{
    label: string;
    href: string;
  }>;
};

export type DoorGraphic = {
  id: string;
  label: string;
  top: string;
  left: string;
  height: string;
};

export type SiteContent = {
  navigation: SectionNavItem[];
  hero: HeroContent;
  projects: Project[];
  about: AboutContent;
  process: ProcessStep[];
  newsletter: NewsletterLink;
  faq: FaqItem[];
  contact: ContactBlock;
  doors: DoorGraphic[];
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
