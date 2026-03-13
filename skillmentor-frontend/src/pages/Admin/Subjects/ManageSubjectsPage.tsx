import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@clerk/clerk-react";

import { getAdminSubjects } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Subject } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ManageSubjectsPage() {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setIsLoading(true);
        const token = await getToken({ template: "skillmentor-auth" });

        if (!token) {
          throw new Error("You must be signed in to view subjects.");
        }

        const response = await getAdminSubjects(token, 0, 100);
        setSubjects(response.content);
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
  }, [getToken, toast]);

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
              <Card key={subject.id} className="overflow-hidden">
                {subject.courseImageUrl ? (
                  <img
                    src={subject.courseImageUrl}
                    alt={title}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-muted text-3xl font-semibold">
                    {title.charAt(0)}
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>Subject ID: {subject.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {subject.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
