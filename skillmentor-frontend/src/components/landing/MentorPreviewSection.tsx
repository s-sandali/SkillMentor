import { useEffect, useState } from "react";
import { MentorCard } from "@/components/MentorCard";
import { getPublicMentors } from "@/lib/api";
import type { Mentor } from "@/types";

export function MentorPreviewSection() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicMentors()
      .then((data) => setMentors(data.content))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section 
      aria-label="Mentor List"
      className="max-w-7xl mx-auto px-6 py-16 space-y-8"
    >
      <div className="text-center md:text-left space-y-2">
         <h2 className="text-3xl md:text-4xl font-bold">Browse Mentors</h2>
         <p className="text-muted-foreground">Find the perfect mentor for your upskilling journey.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted-foreground">
          Loading mentors...
        </div>
      ) : mentors.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No mentors available yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      )}
    </section>
  );
}
