import type { Article, StartHereItem } from "@/lib/types";

export const articles: Article[] = [
  {
    id: "attention-clarity-voice",
    title: "Words built for attention, clarity, and voice.",
    category: "Writing",
    image: "/images/hero/desk.jpg",
    href: "/articles/words-built-for-attention-clarity-and-voice",
    excerpt:
      "The right words make ideas clearer, stories stronger, and messages more memorable.",
  },
  {
    id: "story-advantage",
    title: "Why Story Is the Only Advantage AI Can’t Copy",
    category: "Craft",
    image: "/images/writing/story.jpg",
    href: "/blog/why-story-is-the-only-advantage-ai-cant-copy",
  },
  {
    id: "outline-scripts",
    title: "How I Outline Scripts That Don’t Bore Me",
    category: "Process",
    image: "/images/writing/outline.jpg",
    href: "/blog/how-i-outline-scripts-that-dont-bore-me",
  },
  {
    id: "one-edit",
    title: "The One Edit That Makes Everything Clearer",
    category: "Editing",
    image: "/images/writing/edit.jpg",
    href: "/blog",
  },
  {
    id: "work-with-clients",
    title: "How I Work With Clients (And Stay Sane)",
    category: "Business",
    image: "/images/writing/clients.jpg",
    href: "/blog",
  },
  {
    id: "thinking-about",
    title: "Things I’m Thinking About Right Now",
    category: "Notes",
    image: "/images/writing/thinking.jpg",
    href: "/blog",
  },
];

export const startHereItems: StartHereItem[] = [
  {
    id: "approach-scriptwriting",
    category: "Guide",
    title: "How I Approach Scriptwriting",
    href: "/blog",
  },
  {
    id: "sound-human",
    category: "Craft",
    title: "What Makes Writing Sound Human",
    href: "/blog",
  },
  {
    id: "editing-checklist",
    category: "Checklist",
    title: "The Editing Checklist I Use on Almost Everything",
    href: "/blog",
  },
];
