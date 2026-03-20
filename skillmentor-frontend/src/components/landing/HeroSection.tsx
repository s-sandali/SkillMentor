import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth, SignInButton } from "@clerk/clerk-react";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Initials avatar — no network requests
function InitialsAvatar({ name, bg }: { name: string; bg: string }) {
  return (
    <div
      className="size-7 rounded-full ring-2 ring-white flex items-center justify-center text-white text-[10px] font-bold shrink-0"
      style={{ background: bg }}
      aria-label={name}
    >
      {name.charAt(0)}
    </div>
  );
}

const proofAvatars = [
  { name: "Ravi", bg: "#3b5bdb" },
  { name: "Priya", bg: "#2f9e44" },
  { name: "Sam", bg: "#c2255c" },
];

export function HeroSection() {
  const { isSignedIn } = useAuth();
  // threshold: 0 ensures the observer fires immediately when element mounts in viewport
  const ref = useScrollAnimation<HTMLDivElement>({ threshold: 0, rootMargin: "0px" });

  const scrollToMentors = () => {
    document.getElementById("mentors")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      aria-label="Hero Section"
      className="relative max-w-7xl mx-auto px-6 pt-12 pb-20 flex flex-col items-center justify-center text-center min-h-[88vh]"
    >
      {/* All content in one observed container so children animate via [data-visible] .anim CSS rule */}
      <div ref={ref} className="anim flex flex-col items-center gap-6 max-w-3xl">

        {/* Live badge */}


        {/* Headline */}
        <div className="anim anim-delay-2 space-y-3">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.05] text-gray-900">
            Learn faster with a{" "}
            <span className="relative inline-block">
              <span className="relative z-10">
                real expert
              </span>
              <span
                className="absolute -bottom-1 left-0 right-0 h-[6px] rounded-full"
                style={{ background: "hsl(47 95% 53%)", opacity: 0.5 }}
              />
            </span>{" "}
            by your side.
          </h1>
        </div>

        {/* Sub headline */}
        <p className="anim anim-delay-3 text-lg text-gray-500 max-w-xl leading-relaxed">
          Book 1-on-1 sessions with certified professionals in Cloud, DevOps,
          Machine Learning, UI/UX, and more. Built for career switchers and
          upskill seekers.
        </p>

        {/* CTAs */}
        <div className="anim anim-delay-4 flex flex-wrap items-center justify-center gap-3 mt-2">
          {isSignedIn ? (
            <Link to="/dashboard">
              <Button
                size="lg"
                className="rounded-full bg-black text-white hover:bg-black/80 px-7 shadow-lg gap-2"
              >
                Go to Dashboard
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          ) : (
            <>
              <SignInButton forceRedirectUrl="/dashboard" mode="modal">
                <Button
                  size="lg"
                  className="rounded-full bg-black text-white hover:bg-black/80 px-7 shadow-lg gap-2"
                >
                  <Sparkles className="size-4" />
                  Get Started Free
                </Button>
              </SignInButton>
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToMentors}
                className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 px-7 gap-2"
              >
                Browse Mentors
                <ArrowRight className="size-4" />
              </Button>
            </>
          )}
        </div>

        {/* Social proof strip — uses CSS initials avatars, no image fetches */}
        <div className="anim anim-delay-5 flex flex-wrap items-center justify-center gap-6 mt-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
              {proofAvatars.map((a) => (
                <InitialsAvatar key={a.name} name={a.name} bg={a.bg} />
              ))}
            </div>
            <span>Trusted by 1,200+ learners</span>
          </div>
          <span className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1 font-medium text-gray-700">4.9/5</span>
          </div>
        </div>
      </div>
    </section>
  );
}
