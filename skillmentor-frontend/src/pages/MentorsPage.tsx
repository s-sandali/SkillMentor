import { useEffect, useState } from "react";
import { getPublicMentors } from "@/lib/api";
import { MentorCard } from "@/components/MentorCard";
import { Button } from "@/components/ui/button";
import type { Mentor } from "@/types";
import { Loader2, Users } from "lucide-react";

const PAGE_SIZE = 9;

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPublicMentors(page, PAGE_SIZE)
      .then((data) => {
        setMentors(data.content);
        setTotalPages(data.totalPages);
      })
      .catch(() => setError("Failed to load mentors. Please try again."))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Users className="size-7 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Browse Mentors</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Find an expert mentor and start learning today.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" onClick={() => setPage(0)}>
              Retry
            </Button>
          </div>
        ) : mentors.length === 0 ? (
          <div className="flex items-center justify-center py-32">
            <p className="text-muted-foreground">No mentors available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
