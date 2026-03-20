import { useEffect, useState } from "react";
import { Link } from "react-router";
import { MentorCard } from "@/components/MentorCard";
import { getPublicMentors } from "@/lib/api";
import type { Mentor } from "@/types";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function MentorPreviewSection() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const headingRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  // Section-level ref: always mounted, so observer reliably fires
  const sectionRef = useScrollAnimation<HTMLElement>({ threshold: 0 });

  useEffect(() => {
    getPublicMentors()
      .then((data) => setMentors(data.content))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      ref={sectionRef}
      id="mentors"
      aria-label="Mentor List"
      className="relative max-w-7xl mx-auto px-6 py-24 space-y-10"
    >
      {/* Heading row */}
      <div ref={headingRef} className="anim space-y-5">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.05] max-w-2xl mx-auto">
          Upgrade your skills.{" "}
          <span className="inline-block relative">
            <span className="relative z-10">Unlock new doors.</span>
            <span
              className="absolute -bottom-1 left-0 right-0 h-[5px] rounded-full"
              style={{ background: "hsl(47 95% 53%)", opacity: 0.5 }}
            />
          </span>
        </h2>

        <div className="flex justify-center mt-2">
          <Link
            to="/mentors"
            className="flex items-center rounded-full bg-black text-white pl-6 pr-1 py-1 hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
          >
            <span className="mr-4 font-semibold text-xs tracking-widest uppercase">
              Explore Our Mentors
            </span>
            <div className="bg-white text-black rounded-full p-2 flex items-center justify-center">
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </div>

      {/* Grid — no .anim on the grid itself; cards animate via sectionRef's data-visible */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          Loading mentors…
        </div>
      ) : mentors.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No mentors available yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor, i) => (
            <div
              key={mentor.id}
              className={`anim anim-delay-${Math.min(i + 1, 6)}`}
            >
              <MentorCard mentor={mentor} />
            </div>
          ))}
        </div>
      )}

      {/* View all link */}
      <div className="flex justify-center pt-4">
        <Link
          to="/mentors"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:underline underline-offset-4"
        >
          View all mentors
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
