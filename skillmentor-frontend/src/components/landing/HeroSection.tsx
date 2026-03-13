import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";

export function HeroSection() {
  const { isSignedIn } = useAuth();

  return (
    <section 
      aria-label="Hero Section"
      className="max-w-7xl mx-auto px-6 py-16 min-h-[80vh] flex flex-col items-center justify-between md:flex-row gap-8"
    >
      <div className="flex flex-col items-center justify-center space-y-8 text-center flex-1">
        <div className="space-y-4">
          <h1 className="text-5xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            Find your SkillMentor
          </h1>
          <p className="mx-auto text-gray-500 md:text-xl dark:text-gray-400 max-w-xs sm:max-w-full">
            Empower your career with personalized mentorship for AWS Developer{" "}
            <br className="hidden sm:block" />
            Associate, Interview Prep, and more.
          </p>
        </div>

        {isSignedIn ? (
          <Link to="/dashboard">
            <Button size="lg" className="text-xl">
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button size="lg" className="text-xl">
              Sign up to see all tutors
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
