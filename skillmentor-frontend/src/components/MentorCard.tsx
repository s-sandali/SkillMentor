import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Building2,
  Calendar,
  GraduationCap,
  ShieldCheck,
  ThumbsUp,
  BookOpen,
} from "lucide-react";
import type { Mentor, MentorInfo, SubjectWithEnrollment } from "@/types";
import { BookingModal } from "@/components/mentor-profile/BookingModal";
import { SignupDialog } from "@/components/SignUpDialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";

interface MentorCardProps {
  mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isSignedIn } = useAuth();

  const mentorName = `${mentor.firstName} ${mentor.lastName}`;
  const hasSubjects = mentor.subjects.length > 0;
  const bio = mentor.bio ?? "";
  const bioTooLong = bio.length > 160;

  const mentorInfo = useMemo<MentorInfo>(() => ({
    id: mentor.id,
    mentorId: mentor.mentorId,
    name: mentorName,
    title: mentor.title || undefined,
    profession: mentor.profession || undefined,
    company: mentor.company || undefined,
    profileImage: mentor.profileImageUrl || undefined,
    bio: mentor.bio || undefined,
    startYear: mentor.startYear || undefined,
    isCertified: mentor.isCertified,
  }), [mentor, mentorName]);

  const bookingSubjects = useMemo<SubjectWithEnrollment[]>(() => (
    mentor.subjects.map((s) => ({
      subjectId: s.id,
      subjectName: s.name ?? s.subjectName ?? "",
      subjectDescription: s.description,
      thumbnail: s.courseImageUrl,
      enrollmentCount: 0,
    }))
  ), [mentor.subjects]);

  const handleSchedule = () => {
    if (!isSignedIn) {
      setIsSignupDialogOpen(true);
      return;
    }
    setIsBookingOpen(true);
  };

  return (
    <>
      <Card className="flex flex-col h-full overflow-visible relative">
        {/* Certified badge — anchored to top-right corner of the card */}
        {mentor.isCertified && (
          <div className="absolute -top-2.5 right-4 z-10 flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm">
            <ShieldCheck className="size-3" />
            Certified
          </div>
        )}

        {/* Profile header */}
        <div className="flex items-center gap-4 p-6 pb-4">
          {mentor.profileImageUrl ? (
            <img
              src={mentor.profileImageUrl}
              alt={mentorName}
              className="size-16 rounded-full object-cover object-top ring-2 ring-border shrink-0"
            />
          ) : (
            <div className="size-16 rounded-full bg-muted ring-2 ring-border shrink-0 flex items-center justify-center text-xl font-bold text-muted-foreground">
              {mentor.firstName.charAt(0)}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="font-semibold text-base leading-tight truncate">{mentorName}</h3>
            {mentor.title && (
              <p className="text-sm text-muted-foreground truncate">{mentor.title}</p>
            )}
            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
              <Building2 className="size-3 shrink-0" />
              <span className="truncate">{mentor.company}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
              <Calendar className="size-3 shrink-0" />
              <span>Tutor since {mentor.startYear}</span>
            </div>
          </div>
        </div>

        {/* Stats row — no overflow issues */}
        <div className="mx-6 mb-4 flex items-center gap-0 rounded-lg border border-border divide-x divide-border text-sm overflow-hidden">
          <div className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2">
            <ThumbsUp className="size-3.5 text-primary shrink-0" />
            <span className="font-semibold">{mentor.positiveReviews}%</span>
            <span className="text-muted-foreground text-xs hidden sm:inline">positive</span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2">
            <GraduationCap className="size-3.5 text-primary shrink-0" />
            <span className="font-semibold">{mentor.totalEnrollments}</span>
            <span className="text-muted-foreground text-xs hidden sm:inline">enrolled</span>
          </div>
        </div>

        {/* Bio */}
        <div className="px-6 mb-4 flex-1">
          <p
            className={cn(
              "text-sm text-muted-foreground leading-relaxed transition-all duration-300",
              !isExpanded && bioTooLong ? "line-clamp-3" : "",
            )}
          >
            {bio}
          </p>
          {bioTooLong && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary text-sm font-medium mt-1 hover:underline"
            >
              {isExpanded ? "See less" : "See more"}
            </button>
          )}
        </div>

        {/* Subjects — with thumbnails */}
        {hasSubjects && (
          <div className="px-6 mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
              Teaching
            </p>
            <div className="flex flex-col gap-2">
              {mentor.subjects.map((s) => {
                const name = s.name ?? s.subjectName ?? "";
                const thumb = s.courseImageUrl;
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5"
                  >
                    {/* Thumbnail */}
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={name}
                        className="size-7 rounded-md object-cover shrink-0 ring-1 ring-border"
                      />
                    ) : (
                      <div className="size-7 rounded-md bg-muted flex items-center justify-center shrink-0 ring-1 ring-border">
                        <BookOpen className="size-3.5 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-xs font-medium text-foreground/80 leading-tight line-clamp-1">
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 pt-0 flex flex-col gap-2 mt-auto">
          <Button
            onClick={handleSchedule}
            className="w-full bg-black text-white hover:bg-black/90"
            disabled={!hasSubjects}
            title={!hasSubjects ? "No courses available for this mentor yet" : undefined}
          >
            {hasSubjects ? "Schedule a session" : "No courses available"}
          </Button>
          <Link to={`/mentors/${mentor.id}`} className="w-full">
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </Link>
        </div>
      </Card>

      <SignupDialog
        isOpen={isSignupDialogOpen}
        onClose={() => setIsSignupDialogOpen(false)}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        mentorInfo={mentorInfo}
        subjects={bookingSubjects}
      />
    </>
  );
}
