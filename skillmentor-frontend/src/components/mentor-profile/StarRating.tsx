import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ rating, max = 5, size = "md" }: StarRatingProps) {
  const sizeClass = size === "sm" ? "size-3" : size === "lg" ? "size-5" : "size-4";

  return (
    <div className="flex gap-0.5" aria-label={`Rating: ${rating} out of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            i < Math.round(rating)
              ? "fill-primary text-primary"
              : "fill-muted text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  );
}
