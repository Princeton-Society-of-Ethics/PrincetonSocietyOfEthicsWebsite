import { useRef } from "react";
import CtaBanner from "@/components/sections/CtaBanner";
import AboutPreview from "@/components/sections/home/AboutPreview";
import HomeHero from "@/components/sections/home/HomeHero";
import InitiativesGrid from "@/components/sections/home/InitiativesGrid";
import IntroOverlay from "@/components/sections/home/IntroOverlay";
import SponsorsSection from "@/components/sections/home/SponsorsSection";
import { useFirstVisitIntro } from "@/hooks/useFirstVisitIntro";

export default function HomePage() {
  const { phase, beginExit, finish } = useFirstVisitIntro();
  // Fixed at first render: did the intro run this visit? Keeps the hero's
  // letter reveal active while the overlay finishes fading out.
  const introRan = useRef(phase !== "done").current;

  return (
    <>
      {phase !== "done" && <IntroOverlay onBeginExit={beginExit} onFinish={finish} />}

      {/* Mounted when the overlay starts lifting, so the hero animates in
          underneath it — the intro's dark final frame matches the hero's
          background, making the handoff seamless. */}
      {phase !== "playing" && (
        <>
          <HomeHero titleReveal={introRan} />
          <InitiativesGrid />
          <AboutPreview />
          <SponsorsSection />
          <CtaBanner
            title="Join the Conversation"
            description="Become part of a community dedicated to ethical inquiry, moral leadership, and meaningful dialogue. Attend an event, write for Telos, or become a member."
            actions={[{ label: "Join Us", href: "/join" }]}
          />
        </>
      )}
    </>
  );
}
