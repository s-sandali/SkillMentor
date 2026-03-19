import { Users, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SubjectWithEnrollment } from "@/types";

interface SubjectsGridProps {
  subjects: SubjectWithEnrollment[];
  onBookSubject: (subject: SubjectWithEnrollment) => void;
}

export function SubjectsGrid({ subjects, onBookSubject }: SubjectsGridProps) {
  if (subjects.length === 0) {
    return (
      <section className="container py-10">
        <h2 className="text-2xl font-bold mb-6">Subjects</h2>
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border border-dashed rounded-xl">
          <BookOpen className="size-10 mb-3 opacity-40" />
          <p className="font-medium">No subjects available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-10">
      <h2 className="text-2xl font-bold mb-6">
        Subjects
        <span className="ml-2 text-base font-normal text-muted-foreground">
          ({subjects.length})
        </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((subject) => (
          <Card
            key={subject.subjectId}
            className="flex flex-col overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-muted overflow-hidden">
              {subject.thumbnail ? (
                <img
                  src={subject.thumbnail}
                  alt={subject.subjectName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <BookOpen className="size-10 text-muted-foreground/40" />
                </div>
              )}
            </div>

            <CardContent className="flex flex-col flex-1 p-5 gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-base leading-tight">
                  {subject.subjectName}
                </h3>
                <Badge variant="secondary" className="shrink-0 gap-1 text-xs">
                  <Users className="size-3" />
                  {subject.enrollmentCount}
                </Badge>
              </div>

              {subject.subjectDescription && (
                <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                  {subject.subjectDescription}
                </p>
              )}

              <Button
                size="sm"
                onClick={() => onBookSubject(subject)}
                className="w-full mt-auto bg-black text-white hover:bg-black/80"
              >
                Book This Subject
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
