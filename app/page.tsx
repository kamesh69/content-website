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
import { getHomepageContent } from "@/lib/wordpress";

export const revalidate = 60;

export default async function HomePage() {
  const content = await getHomepageContent();

  return (
    <>
      <SiteHeader
        site={content.site}
        navigation={content.navigation}
        editorialNavigation={content.editorialNavigation}
      />
      <main>
        <Hero hero={content.hero} />
        <EditorialStatement editorialStatement={content.editorialStatement} />
        <ServicesSection services={content.services} servicesIntro={content.servicesIntro} />
        <SelectedWork projects={content.projects} workIntro={content.workIntro} />
        <BehindTheWords behindTheWords={content.behindTheWords} />
        <LatestWriting articles={content.latestArticles} writingIntro={content.writingIntro} />
        <StartHere startHere={content.startHere} startHereItems={content.startHereItems} />
        <AboutSection about={content.about} />
        <ProcessSection processSteps={content.processSteps} processIntro={content.processIntro} />
        <TestimonialSection testimonial={content.testimonial} />
        <FaqSection faqItems={content.faqItems} faqIntro={content.faqIntro} />
        <NewsletterSection newsletter={content.newsletter} />
      </main>
      <SiteFooter site={content.site} navigation={content.navigation} socialLinks={content.socialLinks} />
    </>
  );
}
