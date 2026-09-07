#!/usr/bin/env node

/**
 * One-time migration: pushes all local portfolio content into WordPress.
 *
 * Requires:
 *   WORDPRESS_REST_USER
 *   WORDPRESS_REST_PASSWORD  (Application Password from WP Admin → Users → Profile)
 *   NEXT_PUBLIC_WORDPRESS_URL (default: https://cms.thesportsrivalry.com)
 *
 * Usage:
 *   node scripts/migrate-to-wordpress.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const WP_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.thesportsrivalry.com").replace(
  /\/$/,
  "",
);
const WP_USER = process.env.WORDPRESS_REST_USER;
const WP_PASSWORD = process.env.WORDPRESS_REST_PASSWORD;

if (!WP_USER || !WP_PASSWORD) {
  console.error(
    "Set WORDPRESS_REST_USER and WORDPRESS_REST_PASSWORD (WordPress Application Password).",
  );
  process.exit(1);
}

const authHeader = `Basic ${Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString("base64")}`;

async function wpFetch(endpoint, options = {}) {
  const response = await fetch(`${WP_URL}/wp-json${endpoint}`, {
    ...options,
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(`WP ${options.method ?? "GET"} ${endpoint} failed (${response.status}): ${text}`);
  }

  return data;
}

async function uploadMedia(relativePath, altText = "") {
  const absolutePath = path.join(root, "public", relativePath.replace(/^\//, ""));

  try {
    await fs.access(absolutePath);
  } catch {
    console.warn(`  Skipping missing image: ${relativePath}`);
    return null;
  }

  const buffer = await fs.readFile(absolutePath);
  const filename = path.basename(absolutePath);
  const ext = path.extname(filename).toLowerCase();
  const mime =
    ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";

  const response = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": mime,
    },
    body: buffer,
  });

  const data = await response.json();

  if (!response.ok) {
    console.warn(`  Failed to upload ${relativePath}:`, data);
    return null;
  }

  if (altText) {
    await wpFetch(`/wp/v2/media/${data.id}`, {
      method: "POST",
      body: JSON.stringify({ alt_text: altText }),
    });
  }

  return data.source_url;
}

async function upsertBySlug(postType, slug, payload, meta = {}) {
  const existing = await wpFetch(
    `/wp/v2/${postType}?slug=${encodeURIComponent(slug)}&status=any`,
  );
  const body = {
    title: payload.title,
    content: payload.content ?? "",
    status: "publish",
    slug,
    meta,
  };

  if (payload.featured_media) {
    body.featured_media = payload.featured_media;
  }

  if (existing?.[0]?.id) {
    return wpFetch(`/wp/v2/${postType}/${existing[0].id}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  return wpFetch(`/wp/v2/${postType}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const siteSettings = {
  site: {
    name: "Rati Agrawal",
    role: "Writer & Editor",
    title: "Rati Agrawal — Writer & Editor",
    description:
      "Writer, editor, and storyteller creating scripts, copy, and content people want to keep reading.",
    email: "hello@ratiagrawal.com",
  },
  hero: {
    eyebrow: "Writer · Editor · Storyteller",
    headingLines: ["I turn ideas into", "words people want", "to keep reading."],
    description:
      "I'm a full-time writer and editor creating scripts, copy, and content that sound human, hold attention, and make complicated ideas easier to understand.",
    primaryCta: { label: "Work with me", href: "#contact" },
    secondaryCta: { label: "Read my writing", href: "#writing" },
    tags: [
      { label: "Scriptwriting", href: "#services" },
      { label: "Copywriting", href: "#services" },
      { label: "Editing", href: "#services" },
    ],
    image: "/images/hero/desk.jpg",
    imageAlt: "Rati Agrawal writing at a desk with a laptop and notebooks",
  },
  editorialStatement: {
    left: {
      lineOne: "Good writing doesn't",
      lineTwo: "need more words.",
      accent: "It needs the right ones.",
    },
    right:
      "The right words make ideas clearer, stories stronger, and messages more memorable. That's what I help clients build—across scripts, copy, and content.",
  },
  servicesIntro: {
    label: "What I write",
    heading: "Words built for attention, clarity, and voice.",
  },
  workIntro: {
    label: "Selected work",
    heading: "Things I've put words to.",
  },
  behindTheWords: {
    label: "Behind the words",
    heading: ["From a messy idea to", "a story worth watching."],
    body: "Every project starts with research and questions. Then comes structure, story, and the writing that holds it all together—from framing notes and interview transcripts to a clear narrative arc with purpose and pace.",
    steps: [
      { number: "01", title: "Research" },
      { number: "02", title: "Structure" },
      { number: "03", title: "Story" },
    ],
    cta: { label: "See the project", href: "#work" },
    image: "/images/workspace/notes.jpg",
    imageAlt: "Notebook, handwritten notes, coffee, and writing materials on a desk",
  },
  writingIntro: {
    label: "From the desk",
    heading: "Latest writing",
  },
  startHere: {
    heading: "Start here.",
    aside: {
      eyebrow: "New here?",
      text: "These are a good place to begin.",
    },
  },
  about: {
    heading: ["Hi, I'm Rati.", "I write for a living."],
    lead: "Some people enjoy spreadsheets. I have an unreasonable attachment to sentences.",
    body: "I'm a full-time writer and editor. Most of my working hours go to researching ideas, finding the story inside them, and working out the clearest and most interesting way to put that story into words—whether that's a script, a landing page, or a draft that needs a sharper second pass.",
    cta: { label: "More about me", href: "#process" },
    image: "/images/about/portrait.jpg",
    imageAlt: "Portrait of Rati Agrawal",
  },
  processIntro: {
    heading: ["You bring the idea.", "I'll find the words."],
  },
  testimonial: {
    label: "Kind words",
    heading: "Nice things people have said about my words.",
    quote:
      "Rati has a rare ability to take a complicated idea and turn it into a story that feels simple, clear, and human. Our audience notices.",
    attribution: "Alex R., Director of Content",
  },
  faqIntro: {
    heading: "Before we share a Google Doc...",
  },
  newsletter: {
    heading: "Notes from a writer's desk.",
    description:
      "Thoughts on writing, stories, creativity, freelancing, and whatever else has been occupying my browser tabs lately.",
    placeholder: "Your email address",
    cta: "Subscribe",
  },
  socialLinks: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],
  navigation: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Writing", href: "#writing" },
    { label: "Contact", href: "#contact" },
  ],
  editorialNavigation: [
    { label: "Work", href: "/#work" },
    { label: "Articles", href: "/blog" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "#contact" },
    { label: "Let's Talk", href: "#contact" },
  ],
};

const services = [
  {
    slug: "scriptwriting",
    title: "Scriptwriting",
    content: "Scripts designed around attention, pacing, structure, and story.",
    meta: {
      service_number: "01",
      service_items: JSON.stringify([
        "YouTube Scripts",
        "Video Scripts",
        "Explainer Scripts",
        "Brand Films",
        "Short-Form Scripts",
        "Research-Based Storytelling",
      ]),
      service_cta: "Discuss a script",
      service_href: "#contact",
      sort_order: 1,
    },
  },
  {
    slug: "copywriting",
    title: "Copywriting",
    content: "Clear copy that sounds like a person wrote it because one did.",
    meta: {
      service_number: "02",
      service_items: JSON.stringify([
        "Website Copy",
        "Landing Pages",
        "Brand Copy",
        "Campaign Copy",
        "Social Copy",
        "Digital Content",
      ]),
      service_cta: "Discuss your copy",
      service_href: "#contact",
      sort_order: 2,
    },
  },
  {
    slug: "editing",
    title: "Editing",
    content: "Taking something that almost works and making every sentence earn its place.",
    meta: {
      service_number: "03",
      service_items: JSON.stringify([
        "Copy Editing",
        "Rewriting",
        "Structural Editing",
        "Tone Refinement",
        "Clarity & Flow",
        "Final Polish",
      ]),
      service_cta: "Send me your draft",
      service_href: "#contact",
      sort_order: 3,
    },
  },
];

const projects = [
  {
    slug: "long-way-home",
    title: "The Long Way Home",
    image: "/images/work/long-way-home.jpg",
    meta: {
      project_category: "Script",
      project_type: "YouTube Documentary",
      project_description: "A 4-part documentary series about identity, migration, and starting over.",
      project_href: "#work",
      project_featured: true,
      sort_order: 1,
    },
  },
  {
    slug: "nomad-goods",
    title: "Nomad Goods",
    image: "/images/work/nomad.jpg",
    meta: {
      project_category: "Copy",
      project_type: "Website Copy",
      project_href: "#work",
      project_featured: false,
      sort_order: 2,
    },
  },
  {
    slug: "focus-journal",
    title: "The Focus Journal",
    image: "/images/work/focus-journal.jpg",
    meta: {
      project_category: "Copy",
      project_type: "Founder's Letter",
      project_href: "#work",
      project_featured: false,
      sort_order: 3,
    },
  },
  {
    slug: "what-makes-us-human",
    title: "What Makes Us Human",
    image: "/images/work/human.jpg",
    meta: {
      project_category: "Script",
      project_type: "YouTube Script",
      project_href: "#work",
      project_featured: false,
      sort_order: 4,
    },
  },
  {
    slug: "brand-campaign",
    title: "Brand Campaign",
    image: "/images/work/campaign.jpg",
    meta: {
      project_category: "Copy",
      project_type: "Launch Copy",
      project_href: "#work",
      project_featured: false,
      sort_order: 5,
    },
  },
  {
    slug: "ten-ideas",
    title: "Ten Ideas Worth Remembering",
    image: "/images/work/essay.jpg",
    meta: {
      project_category: "Essay",
      project_type: "Long-Form Essay",
      project_href: "#work",
      project_featured: false,
      sort_order: 6,
    },
  },
  {
    slug: "nonfiction-manuscript",
    title: "Nonfiction Manuscript",
    image: "/images/work/manuscript.jpg",
    meta: {
      project_category: "Edit",
      project_type: "Developmental Edit",
      project_href: "#work",
      project_featured: false,
      sort_order: 7,
    },
  },
];

const faqItems = [
  {
    slug: "scripts",
    title: "What kind of scripts do you write?",
    content:
      "YouTube scripts, brand films, explainers, short-form video, and research-driven documentary narratives. If it needs a clear arc, a human voice, and a reason to keep watching, I can write it.",
    sort_order: 1,
  },
  {
    slug: "research",
    title: "Do you do research?",
    content:
      "Yes. Most projects start with source material, interviews, transcripts, or competitive reading. Research isn't optional if the writing needs to feel authoritative and alive.",
    sort_order: 2,
  },
  {
    slug: "brand-voice",
    title: "Can you match my brand voice?",
    content:
      "That's the job. I'll study your existing materials, extract the patterns that already work, and write in a voice that sounds like you—on your best day.",
    sort_order: 3,
  },
  {
    slug: "rewrite",
    title: "Can you rewrite an existing draft?",
    content:
      "Absolutely. Bring the draft that almost works. I'll tighten structure, clarify the argument, and make every sentence earn its place without erasing what's already strong.",
    sort_order: 4,
  },
  {
    slug: "editing-process",
    title: "What does your editing process look like?",
    content:
      "I start with the big picture—structure, pacing, and purpose—then move line by line for clarity, tone, and flow. You'll get notes you can act on, not a mysterious red-pen massacre.",
    sort_order: 5,
  },
];

const processSteps = [
  { slug: "brief", title: "Brief", content: "Tell me what you're making and why.", step_number: "01", sort_order: 1 },
  { slug: "research", title: "Research", content: "I dig into the topic, audience, and angles.", step_number: "02", sort_order: 2 },
  { slug: "write", title: "Write", content: "The words themselves. Fresh, focused, human.", step_number: "03", sort_order: 3 },
  { slug: "refine", title: "Refine", content: "Feedback, edits, polish, done.", step_number: "04", sort_order: 4 },
];

const startHereItems = [
  { slug: "approach-scriptwriting", title: "How I Approach Scriptwriting", link_category: "Guide", link_href: "/blog", sort_order: 1 },
  { slug: "sound-human", title: "What Makes Writing Sound Human", link_category: "Craft", link_href: "/blog", sort_order: 2 },
  { slug: "editing-checklist", title: "The Editing Checklist I Use on Almost Everything", link_category: "Checklist", link_href: "/blog", sort_order: 3 },
];

async function ensureCategory() {
  const categories = await wpFetch("/wp/v2/categories?slug=rati-writing");
  if (categories?.[0]?.id) {
    return categories[0].id;
  }

  const created = await wpFetch("/wp/v2/categories", {
    method: "POST",
    body: JSON.stringify({ name: "Rati Writing", slug: "rati-writing" }),
  });

  return created.id;
}

async function migrateSiteSettings() {
  console.log("→ Site settings");
  await wpFetch("/rati/v1/site-settings", {
    method: "POST",
    body: JSON.stringify(siteSettings),
  });
}

async function migrateServices() {
  console.log("→ Services");
  for (const service of services) {
    await upsertBySlug("rati_service", service.slug, service, service.meta);
  }
}

async function migrateProjects() {
  console.log("→ Projects");
  for (const project of projects) {
    const mediaUrl = await uploadMedia(project.image);
    let featuredMediaId = null;

    if (mediaUrl) {
      const mediaItems = await wpFetch(`/wp/v2/media?search=${encodeURIComponent(path.basename(project.image))}`);
      featuredMediaId = mediaItems?.[0]?.id ?? null;
    }

    await upsertBySlug(
      "rati_project",
      project.slug,
      { title: project.title, featured_media: featuredMediaId },
      project.meta,
    );
  }
}

async function migrateFaq() {
  console.log("→ FAQ");
  for (const item of faqItems) {
    await upsertBySlug("rati_faq", item.slug, { title: item.title, content: item.content }, {
      sort_order: item.sort_order,
    });
  }
}

async function migrateProcess() {
  console.log("→ Process steps");
  for (const step of processSteps) {
    await upsertBySlug(
      "rati_process_step",
      step.slug,
      { title: step.title, content: step.content },
      { step_number: step.step_number, sort_order: step.sort_order },
    );
  }
}

async function migrateStartHere() {
  console.log("→ Start Here links");
  for (const item of startHereItems) {
    await upsertBySlug(
      "rati_start_here",
      item.slug,
      { title: item.title },
      {
        link_category: item.link_category,
        link_href: item.link_href,
        sort_order: item.sort_order,
      },
    );
  }
}

async function migrateLegalPages() {
  console.log("→ Legal pages");
  await upsertBySlug("pages", "privacy", {
    title: "Privacy Policy",
    content:
      "<p>Replace this placeholder with your production privacy notice covering analytics, newsletter subscriptions, and any WordPress editorial workflows.</p><p>Make sure this page reflects your real data processors, retention policy, cookie behavior, and contact information for privacy requests.</p>",
  });
  await upsertBySlug("pages", "imprint", {
    title: "Imprint",
    content:
      "<p>Replace this page with your legal entity details, registered address, and jurisdictional requirements before launch.</p><p>Suggested fields: business name, owner, address, contact email, registration number, VAT details, and responsible party for editorial content.</p>",
  });
}

async function migrateEditorialPost(categoryId) {
  console.log("→ Editorial flagship post");
  const heroImage = await uploadMedia("/images/hero/desk.jpg", "A writer's desk in warm light");
  let featuredMediaId = null;

  if (heroImage) {
    const mediaItems = await wpFetch("/wp/v2/media?search=desk.jpg");
    featuredMediaId = mediaItems?.[0]?.id ?? null;
  }

  const sections = [
    {
      id: "attention",
      heading: "Why attention comes first",
      paragraphs: [
        "We live in a world of constant noise. Every day, people scroll past hundreds of messages. If your words do not stop them, nothing else matters. Attention is the doorway. Without it, even the best idea will never get the chance to land. That's why the first line, the first sentence, the first few seconds, matter more than most people think.",
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
  ];

  const existing = await wpFetch(
    "/wp/v2/posts?slug=words-built-for-attention-clarity-and-voice&status=any",
  );

  const body = {
    title: "Words built for attention, clarity, and voice.",
    excerpt:
      "The right words make ideas clearer, stories stronger, and messages more memorable. That's what I help clients build across scripts, copy, and content.",
    content:
      "<p>Good words are not just about sounding good. They are about making things happen. They build trust, create connection, and turn readers into believers.</p>",
    status: "publish",
    slug: "words-built-for-attention-clarity-and-voice",
    categories: [categoryId],
    featured_media: featuredMediaId,
    meta: {
      rati_quote: "Good writing does not ask for attention.\nIt earns it.",
      rati_closing:
        "Good words are not just about sounding good. They are about making things happen. They build trust, create connection, and turn readers into believers. That is the kind of writing I believe in and the kind I create for my clients every day.",
      rati_reading_time: "6 min read",
      rati_hero_image_alt:
        "A writer's desk in warm light, with a hand taking notes beside a coffee mug and notebook",
      rati_sections: JSON.stringify(sections),
    },
  };

  if (existing?.[0]?.id) {
    await wpFetch(`/wp/v2/posts/${existing[0].id}`, { method: "POST", body: JSON.stringify(body) });
  } else {
    await wpFetch("/wp/v2/posts", { method: "POST", body: JSON.stringify(body) });
  }
}

async function main() {
  console.log(`Migrating content to ${WP_URL} ...`);

  const categoryId = await ensureCategory();
  await migrateSiteSettings();
  await migrateServices();
  await migrateProjects();
  await migrateFaq();
  await migrateProcess();
  await migrateStartHere();
  await migrateLegalPages();
  await migrateEditorialPost(categoryId);

  console.log("\nDone. Redeploy the Next.js site and verify https://www.ratiiagrawal.com");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
