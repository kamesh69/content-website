import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    id: "scriptwriting",
    number: "01",
    title: "Scriptwriting",
    description: "Scripts designed around attention, pacing, structure, and story.",
    items: [
      "YouTube Scripts",
      "Video Scripts",
      "Explainer Scripts",
      "Brand Films",
      "Short-Form Scripts",
      "Research-Based Storytelling",
    ],
    cta: "Discuss a script",
    href: "#contact",
  },
  {
    id: "copywriting",
    number: "02",
    title: "Copywriting",
    description: "Clear copy that sounds like a person wrote it because one did.",
    items: [
      "Website Copy",
      "Landing Pages",
      "Brand Copy",
      "Campaign Copy",
      "Social Copy",
      "Digital Content",
    ],
    cta: "Discuss your copy",
    href: "#contact",
  },
  {
    id: "editing",
    number: "03",
    title: "Editing",
    description: "Taking something that almost works and making every sentence earn its place.",
    items: [
      "Copy Editing",
      "Rewriting",
      "Structural Editing",
      "Tone Refinement",
      "Clarity & Flow",
      "Final Polish",
    ],
    cta: "Send me your draft",
    href: "#contact",
  },
];
