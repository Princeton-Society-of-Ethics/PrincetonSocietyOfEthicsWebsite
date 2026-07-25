import AboutPreview from "@/components/sections/home/AboutPreview";
import HomeHero from "@/components/sections/home/HomeHero";
import InitiativesGrid from "@/components/sections/home/InitiativesGrid";
import NewsletterSection from "@/components/sections/home/NewsletterSection";
import SponsorsSection from "@/components/sections/home/SponsorsSection";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <InitiativesGrid />
      <AboutPreview />
      <SponsorsSection />
      <NewsletterSection />
    </>
  );
}
