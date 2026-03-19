import { useState } from "react";
import { ShieldCheck, GraduationCap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MentorInfo, MentorStats } from "@/types";

interface MentorAboutSectionProps {
  mentorInfo: MentorInfo;
  stats: MentorStats;
}

export function MentorAboutSection({ mentorInfo, stats }: MentorAboutSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const bio = mentorInfo.bio ?? "";
  const isTruncated = bio.length > 400;

  return (
    <section className="container py-10">
      <h2 className="text-2xl font-bold mb-6">About</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bio */}
        <div className="lg:col-span-2 space-y-4">
          {bio ? (
            <>
              <p
                className={cn(
                  "text-muted-foreground leading-relaxed text-base transition-all duration-300",
                  !isExpanded && isTruncated ? "line-clamp-6" : "",
                )}
              >
                {bio}
              </p>
              {isTruncated && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-secondary text-sm font-medium hover:underline"
                >
                  {isExpanded ? "Read less" : "Read more"}
                </button>
              )}
            </>
          ) : (
            <p className="text-muted-foreground italic">No bio provided.</p>
          )}
        </div>

        {/* Highlights sidebar */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
            Highlights
          </h3>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="size-5 text-secondary shrink-0" />
              <div>
                <p className="text-sm font-semibold">{stats.totalStudents} Students</p>
                <p className="text-xs text-muted-foreground">Total taught</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-secondary shrink-0" />
              <div>
                <p className="text-sm font-semibold">{stats.yearsExperience}+ Years</p>
                <p className="text-xs text-muted-foreground">Experience</p>
              </div>
            </div>

            {mentorInfo.isCertified && (
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-secondary shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Certified Mentor</p>
                  <p className="text-xs text-muted-foreground">Verified credentials</p>
                </div>
              </div>
            )}

            {mentorInfo.startYear && (
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Teaching since {mentorInfo.startYear}</p>
                  <p className="text-xs text-muted-foreground">On SkillMentor</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
