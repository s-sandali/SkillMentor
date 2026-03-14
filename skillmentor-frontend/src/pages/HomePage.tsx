import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ScheduleCallSection } from "@/components/landing/ScheduleCallSection";
import { WhyChooseUsSection } from "@/components/landing/WhyChooseUsSection";
import { MentorPreviewSection } from "@/components/landing/MentorPreviewSection";
import { SuccessStoriesSection } from "@/components/landing/SuccessStoriesSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-1 w-full flex flex-col">
        <HeroSection />
        <div className="w-full bg-muted/30">
          <ScheduleCallSection />
        </div>
        <WhyChooseUsSection />
        <SuccessStoriesSection />
        <div className="w-full bg-muted/30">
          <MentorPreviewSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
