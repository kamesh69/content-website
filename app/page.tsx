import { AboutSection } from "@/components/about-section";
import { BehindTheWords } from "@/components/behind-the-words";
import { EditorialStatement } from "@/components/editorial-statement";
import { FaqSection } from "@/components/faq-section";
import { Hero } from "@/components/hero";
import { LatestWriting } from "@/components/latest-writing";
import { NewsletterSection } from "@/components/newsletter-section";
import { ProcessSection } from "@/components/process-section";
import { SelectedWork } from "@/components/selected-work";
import { ServicesSection } from "@/components/services-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StartHere } from "@/components/start-here";
import { TestimonialSection } from "@/components/testimonial-section";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <EditorialStatement />
        <ServicesSection />
        <SelectedWork />
        <BehindTheWords />
        <LatestWriting />
        <StartHere />
        <AboutSection />
        <ProcessSection />
        <TestimonialSection />
        <FaqSection />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
