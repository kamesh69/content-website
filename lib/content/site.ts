import type { NavItem, SocialLink } from "@/lib/types";

export const site = {
  name: "Rati Agrawal",
  role: "Writer & Editor",
  title: "Rati Agrawal — Writer & Editor",
  description:
    "Writer, editor, and storyteller creating scripts, copy, and content people want to keep reading.",
  email: "hello@ratiagrawal.com",
  ogImage: "/images/hero/desk.jpg",
};

export const navigation: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
];

export const editorialNavigation: NavItem[] = [
  { label: "Work", href: "/#work" },
  { label: "Articles", href: "/blog" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "#contact" },
  { label: "Let’s Talk", href: "#contact" },
];

export const socialLinks: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

export const hero = {
  eyebrow: "Writer · Editor · Storyteller",
  headingLines: ["I turn ideas into", "words people want", "to keep reading."],
  description:
    "I’m a full-time writer and editor creating scripts, copy, and content that sound human, hold attention, and make complicated ideas easier to understand.",
  primaryCta: { label: "Work with me", href: "#contact" },
  secondaryCta: { label: "Read my writing", href: "#writing" },
  tags: [
    { label: "Scriptwriting", href: "#services" },
    { label: "Copywriting", href: "#services" },
    { label: "Editing", href: "#services" },
  ],
  image: "/images/hero/desk.jpg",
  imageAlt: "Rati Agrawal writing at a desk with a laptop and notebooks",
};

export const editorialStatement = {
  left: {
    lineOne: "Good writing doesn’t",
    lineTwo: "need more words.",
    accent: "It needs the right ones.",
  },
  right:
    "The right words make ideas clearer, stories stronger, and messages more memorable. That’s what I help clients build—across scripts, copy, and content.",
};

export const servicesIntro = {
  label: "What I write",
  heading: "Words built for attention, clarity, and voice.",
};

export const workIntro = {
  label: "Selected work",
  heading: "Things I’ve put words to.",
};

export const behindTheWords = {
  label: "Behind the words",
  heading: ["From a messy idea to", "a story worth watching."],
  body: "Every article starts with research and questions. Then comes structure, story, and the writing that holds it all together—from framing notes and interview transcripts to a clear narrative arc with purpose and pace.",
  steps: [
    { number: "01", title: "Research" },
    { number: "02", title: "Structure" },
    { number: "03", title: "Story" },
  ],
  cta: { label: "View Articles", href: "#work" },
  image: "/images/workspace/notes.jpg",
  imageAlt: "Notebook, handwritten notes, coffee, and writing materials on a desk",
};

export const writingIntro = {
  label: "From the desk",
  heading: "Latest writing",
};

export const startHere = {
  heading: "Start here.",
  aside: {
    eyebrow: "New here?",
    text: "These are a good place to begin.",
  },
};

export const about = {
  heading: ["Hi, I’m Rati.", "I write for a living."],
  lead: "Some people enjoy spreadsheets. I have an unreasonable attachment to sentences.",
  body: "I’m a full-time writer and editor. Most of my working hours go to researching ideas, finding the story inside them, and working out the clearest and most interesting way to put that story into words—whether that’s a script, a landing page, or a draft that needs a sharper second pass.",
  cta: { label: "More about me", href: "#process" },
  image: "/images/about/portrait.jpg",
  imageAlt: "Portrait of Rati Agrawal",
};

export const processIntro = {
  heading: ["You bring the idea.", "I’ll find the words."],
};

export const testimonial = {
  label: "Kind words",
  heading: "Nice things people have said about my words.",
  quote:
    "Rati has a rare ability to take a complicated idea and turn it into a story that feels simple, clear, and human. Our audience notices.",
  attribution: "Alex R., Director of Content",
};

export const faqIntro = {
  heading: "Before we share a Google Doc...",
};

export const newsletter = {
  heading: "Notes from a writer’s desk.",
  description:
    "Thoughts on writing, stories, creativity, freelancing, and whatever else has been occupying my browser tabs lately.",
  placeholder: "Your email address",
  cta: "Subscribe",
};
