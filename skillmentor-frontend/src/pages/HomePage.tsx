import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ScheduleCallSection } from "@/components/landing/ScheduleCallSection";
import { WhyChooseUsSection } from "@/components/landing/WhyChooseUsSection";
import { MentorPreviewSection } from "@/components/landing/MentorPreviewSection";
import { SuccessStoriesSection } from "@/components/landing/SuccessStoriesSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="relative flex-1 w-full overflow-hidden bg-white">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: "4rem 4rem",
            maskImage:
              "radial-gradient(ellipse at center, black 45%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 45%, transparent 85%)",
            opacity: 0.4,
          }}
        />
        <div className="relative z-10 flex w-full flex-col">
          {/* Spacer to offset fixed navbar (navbar height ~56px + 16px top offset) */}
          <div className="h-[80px]" aria-hidden="true" />
          <HeroSection />

          <WhyChooseUsSection />

          <MentorPreviewSection />
          <SuccessStoriesSection />


          <FaqSection />
          <ScheduleCallSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
