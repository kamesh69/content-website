import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { ExitOverlayController } from "@/components/exit-overlay-controller";
import { FaqAccordion } from "@/components/faq-accordion";
import { HeroScene } from "@/components/hero-scene";
import { NewsletterCta } from "@/components/newsletter-cta";
import { ProcessTimeline } from "@/components/process-timeline";
import { ProjectShowcase } from "@/components/project-showcase";
import { SectionNav } from "@/components/section-nav";
import { WelcomeLoader } from "@/components/welcome-loader";
import { siteContent } from "@/lib/content/site-content";

export default function HomePage() {
  return (
    <>
      <WelcomeLoader />
      <ExitOverlayController />
      <SectionNav items={siteContent.navigation} />
      <main>
        <HeroScene hero={siteContent.hero} />
        <ProjectShowcase projects={siteContent.projects} />
        <AboutSection about={siteContent.about} />
        <ProcessTimeline process={siteContent.process} />
        <NewsletterCta newsletter={siteContent.newsletter} />
        <FaqAccordion items={siteContent.faq} />
        <ContactSection contact={siteContent.contact} doors={siteContent.doors} />
      </main>
    </>
  );
}
