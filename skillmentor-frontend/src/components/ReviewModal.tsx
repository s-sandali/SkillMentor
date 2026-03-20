import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Enrollment } from "@/types";

interface ReviewModalProps {
  enrollment: Enrollment | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sessionId: number, rating: number, reviewText: string) => Promise<void>;
}

export function ReviewModal({ enrollment, isOpen, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setRating(0);
    setHovered(0);
    setReviewText("");
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!enrollment || rating === 0) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(enrollment.id, rating, reviewText.trim());
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hovered || rating;

  const ratingLabel: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            {enrollment
              ? `Share your experience with ${enrollment.mentorName} for ${enrollment.subjectName}.`
              : "Share your experience."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Star selector */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Your Rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    className={cn(
                      "size-8 transition-colors",
                      star <= displayRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted-foreground/30",
                    )}
                  />
                </button>
              ))}
              {displayRating > 0 && (
                <span className="ml-2 text-sm font-medium text-muted-foreground">
                  {ratingLabel[displayRating]}
                </span>
              )}
            </div>
          </div>

          {/* Review text */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="review-text">
              Your Review{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              id="review-text"
              placeholder="What did you enjoy about this session? What could be improved?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              maxLength={1000}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {reviewText.length}/1000
            </p>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? "Submitting…" : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
