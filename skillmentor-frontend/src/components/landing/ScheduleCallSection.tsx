import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth, SignInButton } from "@clerk/clerk-react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function ScheduleCallSection() {
  const { isSignedIn } = useAuth();
  const ref = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section
      id="contact"
      aria-label="Schedule a Call"
      className="relative overflow-hidden"
    >
      {/* Full-bleed dark banner */}
      <div className="mx-6 mb-16 rounded-3xl bg-black overflow-hidden">
        {/* Decorative glow blob */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 100%, hsl(47 95% 53% / 0.15) 0%, transparent 70%)",
          }}
        />

        <div
          ref={ref}
          className="anim relative z-10 flex flex-col items-center text-center px-8 py-20 gap-7"
        >


          {/* Headline */}
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
              Your next career move{" "}
              <br className="hidden sm:block" />
              starts with one session.
            </h2>
            <p className="text-white/55 md:text-lg max-w-xl mx-auto leading-relaxed">
              Book a one-on-one session with an expert mentor today and take
              the first concrete step toward your goals.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {isSignedIn ? (
              <Link to="/mentors">
                <Button
                  size="lg"
                  className="rounded-full px-8 font-semibold gap-2"
                  style={{ background: "hsl(47 95% 53%)", color: "#000" }}
                >

                  Browse Mentors
                </Button>
              </Link>
            ) : (
              <>
                <SignInButton forceRedirectUrl="/dashboard" mode="modal">
                  <Button
                    size="lg"
                    className="rounded-full px-8 font-semibold gap-2"
                    style={{ background: "hsl(47 95% 53%)", color: "#000" }}
                  >
                    <Sparkles className="size-4" />
                    Get Started Free
                  </Button>
                </SignInButton>
                <Link to="/mentors">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-full px-8 text-white/70 hover:text-white hover:bg-white/10 gap-2 border border-white/10"
                  >
                    Browse Mentors
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-2 text-sm text-white/40 divide-x divide-white/10">
            {["1,200+ learners", "200+ certified mentors", "4.9★ avg rating"].map((stat) => (
              <span key={stat} className="px-6 first:pl-0 last:pr-0 font-medium text-white/60">
                {stat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
