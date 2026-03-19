import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import type { MentorReview } from "@/types";
import { StarRating } from "./StarRating";

interface ReviewsSectionProps {
  reviews: MentorReview[];
  averageRating: number;
  totalReviews: number;
}

export function ReviewsSection({
  reviews,
  averageRating,
  totalReviews,
}: ReviewsSectionProps) {
  return (
    <section className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Reviews
          <span className="ml-2 text-base font-normal text-muted-foreground">
            ({totalReviews})
          </span>
        </h2>

        {totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={averageRating} size="lg" />
            <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border border-dashed rounded-xl">
          <MessageSquare className="size-10 mb-3 opacity-40" />
          <p className="font-medium">No reviews yet.</p>
          <p className="text-sm mt-1">Be the first to review after your session!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.reviewId} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}

function ReviewCard({ review }: { review: MentorReview }) {
  const initials = review.studentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  let formattedDate = "";
  try {
    formattedDate = format(parseISO(review.reviewDate), "MMM d, yyyy");
  } catch {
    formattedDate = review.reviewDate;
  }

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-sm">{review.studentName}</p>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>

        {review.reviewText && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            "{review.reviewText}"
          </p>
        )}
      </CardContent>
    </Card>
  );
}
