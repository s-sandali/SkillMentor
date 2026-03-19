import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { Trash2 } from "lucide-react";

import { deleteMentor, getMentors } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Mentor } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PAGE_SIZE = 12;

export default function ManageMentorsPage() {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [deletingMentor, setDeletingMentor] = useState<Mentor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadMentors = async () => {
      try {
        setIsLoading(true);
        const token = await getToken({ template: "skillmentor-auth" });

        if (!token) {
          throw new Error("You must be signed in to view mentors.");
        }

        const response = await getMentors(token, page, PAGE_SIZE);
        setMentors(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (error) {
        toast({
          title: "Failed to load mentors",
          description:
            error instanceof Error ? error.message : "Unable to fetch mentors.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMentors();
  }, [getToken, page, toast]);

  const handleDelete = async () => {
    if (!deletingMentor) return;

    try {
      setIsDeleting(true);
      const token = await getToken({ template: "skillmentor-auth" });
      if (!token) throw new Error("You must be signed in.");

      await deleteMentor(token, deletingMentor.id);
      setMentors((current) => current.filter((m) => m.id !== deletingMentor.id));
      setTotalElements((n) => n - 1);
      toast({ title: "Mentor deleted", description: `${deletingMentor.firstName} ${deletingMentor.lastName} has been removed.` });
      setDeletingMentor(null);
    } catch (error) {
      toast({
        title: "Failed to delete mentor",
        description: error instanceof Error ? error.message : "Unable to delete mentor.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const start = page * PAGE_SIZE + 1;
  const end = Math.min((page + 1) * PAGE_SIZE, totalElements);
  const summary =
    totalElements === 0
      ? "No mentors found"
      : `Showing ${start}–${end} of ${totalElements} mentors`;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Mentors</h2>
          <p className="text-muted-foreground">
            View and manage mentor applications and accounts.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/mentors/create">Create Mentor</Link>
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-sm text-muted-foreground">
            Loading mentors...
          </CardContent>
        </Card>
      ) : mentors.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-sm text-muted-foreground">
            No mentors found yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mentors.map((mentor) => {
            const mentorName = `${mentor.firstName} ${mentor.lastName}`.trim();

            return (
              <Card key={mentor.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  {mentor.profileImageUrl ? (
                    <img
                      src={mentor.profileImageUrl}
                      alt={mentorName}
                      className="size-16 rounded-2xl object-cover object-top"
                    />
                  ) : (
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-lg font-semibold">
                      {mentorName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <CardTitle>{mentorName}</CardTitle>
                    <CardDescription>{mentor.title || mentor.profession}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">{mentor.email}</p>
                  <p>
                    <span className="font-medium">Company:</span>{" "}
                    {mentor.company || "Not set"}
                  </p>
                  <p>
                    <span className="font-medium">Experience:</span>{" "}
                    {mentor.experienceYears} years
                  </p>
                  <p>
                    <span className="font-medium">Certified:</span>{" "}
                    {mentor.isCertified ? "Yes" : "No"}
                  </p>
                  <p className="line-clamp-3 text-muted-foreground">{mentor.bio}</p>
                  <div className="pt-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeletingMentor(mentor)}
                    >
                      <Trash2 className="mr-1 size-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{summary}</p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0 || isLoading}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoading || page >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingMentor} onOpenChange={(open) => !open && setDeletingMentor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Mentor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {deletingMentor?.firstName} {deletingMentor?.lastName}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingMentor(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Mentor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
