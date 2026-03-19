import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Trash2 } from "lucide-react";
import * as z from "zod";

import { deleteSubject, getAdminSubjects, getMentors, updateSubject } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Mentor, Subject } from "@/types";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const PAGE_SIZE = 12;

const editSchema = z.object({
  subjectName: z.string().min(5, "Subject name must be at least 5 characters."),
  description: z
    .string()
    .min(1, "Description is required.")
    .max(500, "Description must not exceed 500 characters."),
  courseImageUrl: z
    .string()
    .url("Must be a valid URL.")
    .optional()
    .or(z.literal("")),
  mentorId: z.string().min(1, "Mentor is required."),
});

type EditFormValues = z.infer<typeof editSchema>;

export default function ManageSubjectsPage() {
  const { getToken } = useAuth();
  const { toast } = useToast();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editMentors, setEditMentors] = useState<Mentor[]>([]);
  const [isLoadingMentors, setIsLoadingMentors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      subjectName: "",
      description: "",
      courseImageUrl: "",
      mentorId: "",
    },
  });

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setIsLoading(true);
        const token = await getToken({ template: "skillmentor-auth" });

        if (!token) {
          throw new Error("You must be signed in to view subjects.");
        }

        const response = await getAdminSubjects(token, page, PAGE_SIZE);
        setSubjects(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (error) {
        toast({
          title: "Failed to load subjects",
          description:
            error instanceof Error ? error.message : "Unable to fetch subjects.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSubjects();
  }, [getToken, page, toast]);

  const openEditDialog = async (subject: Subject) => {
    setEditingSubject(subject);
    const title = subject.name ?? subject.subjectName ?? "";
    editForm.reset({
      subjectName: title,
      description: subject.description ?? "",
      courseImageUrl: subject.courseImageUrl ?? "",
      mentorId: "",
    });

    setIsLoadingMentors(true);
    try {
      const token = await getToken({ template: "skillmentor-auth" });
      if (token) {
        const res = await getMentors(token, 0, 100);
        setEditMentors(res.content);
      }
    } catch {
      toast({ title: "Could not load mentors", variant: "destructive" });
    } finally {
      setIsLoadingMentors(false);
    }
  };

  const handleEditSubmit = async (values: EditFormValues) => {
    if (!editingSubject) return;

    try {
      setIsSubmitting(true);
      const token = await getToken({ template: "skillmentor-auth" });
      if (!token) throw new Error("You must be signed in.");

      const updated = await updateSubject(token, editingSubject.id, {
        subjectName: values.subjectName,
        description: values.description,
        mentorId: Number(values.mentorId),
        courseImageUrl: values.courseImageUrl || undefined,
      });

      setSubjects((current) =>
        current.map((s) => (s.id === editingSubject.id ? updated : s)),
      );
      toast({ title: "Subject updated", description: `"${values.subjectName}" has been saved.` });
      setEditingSubject(null);
    } catch (error) {
      toast({
        title: "Failed to update subject",
        description: error instanceof Error ? error.message : "Unable to save changes.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSubject) return;

    try {
      setIsDeleting(true);
      const token = await getToken({ template: "skillmentor-auth" });
      if (!token) throw new Error("You must be signed in.");

      await deleteSubject(token, deletingSubject.id);
      setSubjects((current) => current.filter((s) => s.id !== deletingSubject.id));
      setTotalElements((n) => n - 1);
      toast({ title: "Subject deleted" });
      setDeletingSubject(null);
    } catch (error) {
      toast({
        title: "Failed to delete subject",
        description: error instanceof Error ? error.message : "Unable to delete subject.",
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
      ? "No subjects found"
      : `Showing ${start}–${end} of ${totalElements} subjects`;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Subjects</h2>
          <p className="mt-2 text-muted-foreground">
            Review every subject currently available on the platform.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/subjects/create">Create Subject</Link>
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-sm text-muted-foreground">
            Loading subjects...
          </CardContent>
        </Card>
      ) : subjects.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-sm text-muted-foreground">
            No subjects found yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => {
            const title = subject.name ?? subject.subjectName ?? "Untitled Subject";

            return (
              <Card key={subject.id} className="overflow-hidden border-border/70 bg-card/95 shadow-sm">
                <div className="border-b bg-muted/35">
                  {subject.courseImageUrl ? (
                    <div className="flex min-h-56 items-center justify-center p-4">
                      <img
                        src={subject.courseImageUrl}
                        alt={title}
                        className="max-h-56 w-full rounded-xl object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-56 items-center justify-center bg-muted text-3xl font-semibold">
                      {title.charAt(0)}
                    </div>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-2 text-2xl">{title}</CardTitle>
                  <CardDescription>
                    Subject details and admin actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex h-full flex-col space-y-4">
                  <p className="min-h-24 text-sm leading-7 text-muted-foreground">
                    {subject.description}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => openEditDialog(subject)}
                    >
                      <Pencil className="mr-1 size-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => setDeletingSubject(subject)}
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

      {/* Edit Dialog */}
      <Dialog open={!!editingSubject} onOpenChange={(open) => !open && setEditingSubject(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Update the details for this subject. You must re-select the assigned mentor.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="subjectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mathematics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the subject..."
                        className="min-h-24 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="courseImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="mentorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Mentor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingMentors}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingMentors ? "Loading mentors..." : "Select a mentor"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {editMentors.map((mentor) => (
                          <SelectItem key={mentor.id} value={String(mentor.id)}>
                            {mentor.firstName} {mentor.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingSubject(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingSubject}
        onOpenChange={(open) => !open && setDeletingSubject(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subject</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {deletingSubject?.name ?? deletingSubject?.subjectName ?? "this subject"}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingSubject(null)}
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
              {isDeleting ? "Deleting..." : "Delete Subject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
