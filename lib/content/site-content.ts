import type {
  AboutContent,
  ContactBlock,
  DoorGraphic,
  FaqItem,
  HeroContent,
  NewsletterLink,
  ProcessStep,
  Project,
  SectionNavItem,
  SiteContent,
} from "@/lib/types";

const navigation: SectionNavItem[] = [
  { label: "Intro", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Faq", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const hero: HeroContent = {
  eyebrow: "Adaptive brand and digital designer",
  topCopy:
    "I build websites, identity systems, campaigns, and digital experiences that feel composed instead of assembled. Big rebrands, weird portfolios, product launches, and all the tension in between.",
  bottomCopy:
    "If you landed here, you are probably looking for someone who can shape the narrative and then actually build the thing. That is the whole point of this studio.",
  titleTop: "Portfolio V",
  titleBottom: "Aarav",
  titleAccent: "Mirelle Studio",
  centerCaption: "(Adaptive brand designer & creative developer)",
  sideMonogram: "AM",
  logoWallLabel: "AARAVMIRELLEAARAVMIRELLEAARAVMIRELLEAARAVMIRELLE",
  supportingText:
    "An editorial portfolio rebuilt to mirror the structure and motion pacing of the reference, but rebranded around an original studio voice.",
  commandments: [
    "You shall not overload the landing page.",
    "You shall use motion with intent.",
    "You shall not hide the work behind empty spectacle.",
    "You shall keep the weirdness readable.",
    "You shall build for memory, not noise.",
  ],
  metrics: ["Direction", "Design", "Development", "Identity"],
  backgroundImage:
    "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=2200&q=80",
  floatingCardTitle: "Intro Notes",
  floatingCardBody:
    "Fixed artwork, oversized typography, repeated glyphs, and a long scroll runway set the same structural tone as the source site while keeping the branding original.",
};

const projects: Project[] = [
  {
    id: "project-01",
    title: "Signal Room",
    year: "2026",
    services: ["Creative Direction", "Web Design", "Development"],
    summary:
      "A broadcast-inspired launch page with a screen-within-screen narrative, analog framing, and purchase-driven storytelling.",
    link: "https://example.com/signal-room",
    coverImage:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80",
    tvVideo:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    gallery: [
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "project-02",
    title: "Cedarline",
    year: "2025",
    services: ["Brand System", "Storytelling", "Frontend"],
    summary:
      "A quieter editorial microsite balancing brutal spacing, soft serif details, and looping screen content.",
    link: "https://example.com/room-for-echoes",
    coverImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    tvVideo:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
    gallery: [
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "project-03",
    title: "After Midnight",
    year: "2024",
    services: ["Identity", "Motion System", "Experience Build"],
    summary:
      "A late-night cable archive aesthetic used for a campaign site with punchy typography and dense atmospheric motion.",
    link: "https://example.com/after-midnight",
    coverImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    tvVideo:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    gallery: [
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "project-04",
    title: "Aster Index",
    year: "2023",
    services: ["Digital Campaign", "Interface", "Development"],
    summary:
      "A publication-inspired launch system built around a single scene, sharp type, and layered media surfaces.",
    link: "https://example.com/aster-index",
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    tvVideo:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
    gallery: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "project-05",
    title: "Burnish",
    year: "2022",
    services: ["Art Direction", "Experience Build", "Frontend"],
    summary:
      "A warmer studio identity stretched into an atmospheric portfolio with looping panels and archival copy.",
    link: "https://example.com/burnish",
    coverImage:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    tvVideo:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    gallery: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "project-06",
    title: "Cargo Form",
    year: "2021",
    services: ["Brand System", "Web Design", "Motion"],
    summary:
      "A restrained commerce system wrapped in cinematic transitions, dark materials, and oversized navigation.",
    link: "https://example.com/cargo-form",
    coverImage:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
    tvVideo:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
    gallery: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "project-07",
    title: "North Frame",
    year: "2020",
    services: ["Campaign", "Storytelling", "Development"],
    summary:
      "An open-road campaign page designed to feel like a moving still frame with minimal interface chrome.",
    link: "https://example.com/north-frame",
    coverImage:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80",
    tvVideo:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    gallery: [
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "project-08",
    title: "Studio Rail",
    year: "2019",
    services: ["Creative Direction", "Typography", "Frontend"],
    summary:
      "A studio presentation piece with compressed typography, screen-led transitions, and an authored pacing model.",
    link: "https://example.com/studio-rail",
    coverImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80",
    tvVideo:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
    gallery: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

const about: AboutContent = {
  eyebrow: "About",
  heading: "An editorial portfolio shell with a sharper production backbone.",
  intro:
    "This implementation keeps the odd, art-directed pacing of the reference while restructuring it into maintainable sections, reusable modules, and a content model that can grow with the studio.",
  body: [
    "The visual language here leans into oversized serif typography, severe spacing, frame-like borders, fixed backgrounds, and a layout that reads like an authored sequence rather than a landing page template.",
    "The homepage stays code-managed on purpose. That keeps the loader, intro, work reveal, and leave-state choreography stable while WordPress handles only the repeatable blog content.",
  ],
  quote:
    "The goal is not to look trendy. The goal is to look authored, memorable, and technically sharp.",
  collage: [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=80",
  ],
  heroImage:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=80",
  manifesto: [
    "HI! I'M AARAV. I AM A DESIGNER WHICH MEANS I DO NOT KEEP ONE STYLE ON A SHELF.",
    "THE JOB IS TO SHAPE SOMETHING THAT FITS THE CLIENT, THE MOMENT, AND THE STORY WE NEED TO TELL.",
  ],
  practice: [
    "I MAINLY BUILD WEBSITES, WEB DEVELOPMENT SYSTEMS, AND BRAND IDENTITIES.",
    "FROM TIME TO TIME I ALSO DIRECT CAMPAIGNS, GRAPHICS, PACKAGING, PRESENTATIONS, AND WHATEVER ELSE THE PROJECT ACTUALLY NEEDS.",
  ],
  stats: [
    {
      label: "Selected recognition:",
      values: [
        "08x Site of the Day",
        "03x Honorable Mention",
        "02x Studio of the Year shortlist",
      ],
    },
    {
      label: "Capabilities:",
      values: [
        "Web design and art direction",
        "Frontend systems and motion choreography",
        "Brand identities and campaign surfaces",
      ],
    },
    {
      label: "Collaborations:",
      values: [
        "Fashion labels",
        "Studios and independent founders",
        "Music, culture, and product launches",
      ],
    },
    {
      label: "Operating model:",
      values: [
        "Small team, direct communication",
        "Concept to shipped build",
        "Code-managed homepage, CMS-backed blog",
      ],
    },
  ],
  sections: [
    {
      number: "01.",
      title: "Design decisions",
      body:
        "This portfolio intentionally mixes modern grids, old-world serif display, screen-like media framing, and slightly awkward graphic moments to show range instead of one safe visual trick.",
    },
    {
      number: "02.",
      title: "Why this structure",
      body:
        "The homepage is paced like a directed scene: a long intro, an anchored work section, an opinionated about section, a process runway, then a deliberately loud final contact stretch.",
    },
    {
      number: "03.",
      title: "Why code-managed",
      body:
        "The experience depends on fixed artwork, timeline-based reveals, route-aware overlays, and typography placement that would be painful to preserve through a general-purpose page builder.",
    },
  ],
};

const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Briefing",
    body: "Collect business goals, audience, sitemap scope, references, launch constraints, and the emotional tone the site should leave behind.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
  },
  {
    number: "02",
    title: "Evaluation",
    body: "Translate the brief into mood, pacing, typography, material references, and a system of repeatable visual motifs.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
  },
  {
    number: "03",
    title: "Kickoff",
    body: "Design the key screens and transitions first so the visual story is coherent before the build becomes production-heavy.",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
  },
  {
    number: "04",
    title: "Design",
    body: "Implement the sections as reusable components with local typed content, motion primitives, and fallback behavior for low-power devices.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  },
  {
    number: "05",
    title: "Development",
    body: "Replace placeholder copy, media, and outbound links with your studio narrative, licensed project assets, and final newsletter target.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  },
  {
    number: "06",
    title: "Quality Assurance",
    body: "Test motion thresholds, mobile breakpoints, WordPress content pulls, route transitions, and Hostinger VPS deployment behavior.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
  },
];

const newsletter: NewsletterLink = {
  eyebrow: "Newsletter",
  title: "Get the studio dispatch",
  description:
    "A new section placed right after Process. Use it to open your external signup destination in a new tab without interrupting the homepage rhythm.",
  href: process.env.NEWSLETTER_URL ?? "https://newsletter.example.com",
  cta: "Open newsletter",
};

const faq: FaqItem[] = [
  {
    question: "Can I edit the homepage from WordPress?",
    answer:
      "Not in v1. The homepage is intentionally code-managed so the loader, hero, project media choreography, and leave overlay stay consistent and easier to art direct.",
    askedBy: "asked by founders",
  },
  {
    question: "Why is the blog separate from the homepage content model?",
    answer:
      "Blog posts benefit from a CMS because they are repeatable editorial entries. The homepage behaves more like a directed experience than a flexible content tree.",
    askedBy: "asked by marketing teams",
  },
  {
    question: "Can the leave screen really trigger on tab close?",
    answer:
      "Browsers do not reliably allow custom media playback on real tab close. This build instead uses a timed exit overlay for interceptable leave actions like outbound clicks, history navigation, and hidden-tab events.",
    askedBy: "asked by product teams",
  },
  {
    question: "What happens if WordPress is offline?",
    answer:
      "The homepage continues to work. The blog section falls back to placeholder content at build time or shows a graceful empty state if the CMS is unreachable.",
    askedBy: "asked by operations",
  },
];

const contact: ContactBlock = {
  eyebrow: "Contact",
  heading: "Write me something nice.",
  body:
    "Bring the business goals, the audience, the constraints, the references you love, and the reason this project actually matters. The stronger the brief, the stronger the result.",
  email: "hello@aaravmirelle.studio",
  details: [
    "Who you are and what you do",
    "Scope, timeline, and desired launch window",
    "References you love and constraints we should know",
  ],
  finishStrongTitle: "We need to finish strong",
  finishStrongBody:
    "The reference site closes loudly. This version does too: newsletter, FAQ, a confrontational contact block, and a leave-state overlay designed to catch people before they vanish.",
  socialLinks: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Behance", href: "https://behance.net" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
  legalLinks: [
    { label: "Imprint", href: "/imprint" },
    { label: "Privacy", href: "/privacy" },
  ],
  studioLinks: [
    { label: "Blog", href: "/blog" },
    { label: "Newsletter", href: process.env.NEWSLETTER_URL ?? "https://newsletter.example.com" },
  ],
};

const doors: DoorGraphic[] = [
  { id: "door-1", label: "North door", top: "16%", left: "8%", height: "18rem" },
  { id: "door-2", label: "Gallery door", top: "48%", left: "82%", height: "16rem" },
  { id: "door-3", label: "Contact door", top: "20%", left: "68%", height: "22rem" },
];

export const siteContent: SiteContent = {
  navigation,
  hero,
  projects,
  about,
  process: processSteps,
  newsletter,
  faq,
  contact,
  doors,
};
