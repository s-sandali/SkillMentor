import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Building2, Briefcase, CalendarDays } from "lucide-react";
import type { MentorInfo } from "@/types";
import { StarRating } from "./StarRating";

interface MentorHeaderSectionProps {
  mentorInfo: MentorInfo;
  averageRating: number;
  totalReviews: number;
  onBookClick: () => void;
}

export function MentorHeaderSection({
  mentorInfo,
  averageRating,
  totalReviews,
  onBookClick,
}: MentorHeaderSectionProps) {
  const initials = mentorInfo.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile image */}
          <div className="shrink-0">
            {mentorInfo.profileImage ? (
              <img
                src={mentorInfo.profileImage}
                alt={mentorInfo.name}
                className="size-36 md:size-44 rounded-full object-cover object-top ring-4 ring-primary/60 shadow-2xl"
              />
            ) : (
              <div className="size-36 md:size-44 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-4 ring-primary/60 shadow-2xl">
                <span className="text-4xl md:text-5xl font-bold text-slate-900">
                  {initials}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                {mentorInfo.isCertified && (
                  <Badge className="bg-primary text-primary-foreground gap-1 text-xs">
                    <ShieldCheck className="size-3" />
                    Certified
                  </Badge>
                )}
                {mentorInfo.startYear && (
                  <Badge variant="outline" className="border-white/30 text-white/80 text-xs gap-1">
                    <CalendarDays className="size-3" />
                    Since {mentorInfo.startYear}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {mentorInfo.name}
              </h1>

              {mentorInfo.title && (
                <p className="text-lg text-white/70 mt-1">{mentorInfo.title}</p>
              )}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-white/60">
              {mentorInfo.profession && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="size-4" />
                  {mentorInfo.profession}
                </span>
              )}
              {mentorInfo.company && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="size-4" />
                  {mentorInfo.company}
                </span>
              )}
            </div>

            {/* Rating */}
            {averageRating > 0 && (
              <div className="flex items-center justify-center md:justify-start gap-2">
                <StarRating rating={averageRating} />
                <span className="text-white font-semibold">{averageRating.toFixed(1)}</span>
                <span className="text-white/50 text-sm">({totalReviews} reviews)</span>
              </div>
            )}

            <Button
              onClick={onBookClick}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg"
            >
              Book a Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
