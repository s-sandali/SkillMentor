import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMentorProfile, getMentorReviews } from "@/lib/api";
import type { MentorProfile, MentorReviewsResponse, SubjectWithEnrollment } from "@/types";
import { MentorHeaderSection } from "@/components/mentor-profile/MentorHeaderSection";
import { MentorStatsSection } from "@/components/mentor-profile/MentorStatsSection";
import { MentorAboutSection } from "@/components/mentor-profile/MentorAboutSection";
import { SubjectsGrid } from "@/components/mentor-profile/SubjectsGrid";
import { ReviewsSection } from "@/components/mentor-profile/ReviewsSection";
import { BookingModal } from "@/components/mentor-profile/BookingModal";
import { SignupDialog } from "@/components/SignUpDialog";

export default function MentorProfilePage() {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [reviewsData, setReviewsData] = useState<MentorReviewsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [preSelectedSubject, setPreSelectedSubject] = useState<SubjectWithEnrollment | null>(null);

  const numericId = mentorId ? Number.parseInt(mentorId, 10) : NaN;

  const fetchData = async () => {
    if (Number.isNaN(numericId)) {
      setError("Invalid mentor ID.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [profileData, reviews] = await Promise.all([
        getMentorProfile(numericId),
        getMentorReviews(numericId).catch(() => null), // reviews are non-critical
      ]);
      setProfile(profileData);
      setReviewsData(reviews);
    } catch {
      setError("Mentor not found or failed to load. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericId]);

  const handleBookClick = (subject?: SubjectWithEnrollment) => {
    if (!isSignedIn) {
      setIsSignupOpen(true);
      return;
    }
    setPreSelectedSubject(subject ?? null);
    setIsBookingOpen(true);
  };

  // --- Loading skeleton ---
  if (isLoading) {
    return (
      <div className="min-h-screen animate-pulse">
        {/* Header skeleton */}
        <div className="bg-slate-200 h-64 w-full" />
        {/* Stats skeleton */}
        <div className="bg-white border-b border-border">
          <div className="container py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
        {/* Body skeleton */}
        <div className="container py-10 space-y-4">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-4/6 bg-muted rounded" />
          <div className="mt-8 h-8 w-40 bg-muted rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (error || !profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="size-12 text-destructive opacity-70" />
        <h2 className="text-xl font-semibold">
          {error ?? "Something went wrong"}
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          We couldn't load this mentor's profile.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4 mr-2" />
            Go back
          </Button>
          <Button onClick={fetchData}>
            <RefreshCw className="size-4 mr-2" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const { mentorInfo, mentorStats, subjects, reviews: profileReviews } = profile;
  const displayReviews = reviewsData?.reviews ?? profileReviews;
  const avgRating = reviewsData?.averageRating ?? mentorStats.averageRating;
  const totalReviews = reviewsData?.totalReviews ?? displayReviews.length;

  return (
    <>
      {/* Back navigation */}
      <div className="bg-white border-b border-border">
        <div className="container py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        </div>
      </div>

      <MentorHeaderSection
        mentorInfo={mentorInfo}
        averageRating={avgRating}
        totalReviews={totalReviews}
        onBookClick={() => handleBookClick()}
      />

      <MentorStatsSection stats={mentorStats} />

      <div className="bg-background">
        <MentorAboutSection mentorInfo={mentorInfo} stats={mentorStats} />

        <div className="border-t border-border">
          <SubjectsGrid
            subjects={subjects}
            onBookSubject={(subject) => handleBookClick(subject)}
          />
        </div>

        <div className="border-t border-border">
          <ReviewsSection
            reviews={displayReviews}
            averageRating={avgRating}
            totalReviews={totalReviews}
          />
        </div>
      </div>

      {/* Booking modals */}
      {isSignedIn && profile && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          mentorInfo={mentorInfo}
          subjects={subjects}
          preSelectedSubject={preSelectedSubject}
        />
      )}

      <SignupDialog
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </>
  );
}
