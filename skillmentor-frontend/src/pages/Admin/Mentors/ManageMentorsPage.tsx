import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@clerk/clerk-react";

import { getMentors } from "@/lib/api";
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

export default function ManageMentorsPage() {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMentors = async () => {
      try {
        setIsLoading(true);
        const token = await getToken({ template: "skillmentor-auth" });

        if (!token) {
          throw new Error("You must be signed in to view mentors.");
        }

        const response = await getMentors(token, 0, 100);
        setMentors(response.content);
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
  }, [getToken, toast]);

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
                  <div className="space-y-1">
                    <CardTitle>{mentorName}</CardTitle>
                    <CardDescription>{mentor.title || mentor.profession}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">{mentor.email}</p>
                  <p>
                    <span className="font-medium">Company:</span> {mentor.company || "Not set"}
                  </p>
                  <p>
                    <span className="font-medium">Experience:</span>{" "}
                    {mentor.experienceYears} years
                  </p>
                  <p>
                    <span className="font-medium">Certified:</span>{" "}
                    {mentor.isCertified ? "Yes" : "No"}
                  </p>
                  <p className="line-clamp-4 text-muted-foreground">{mentor.bio}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
