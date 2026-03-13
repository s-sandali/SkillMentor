import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useToast } from "@/hooks/use-toast";
import { createAdminSubject, getMentors } from "@/lib/api";
import type { Mentor } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const subjectFormSchema = z.object({
  name: z.string().min(1, { message: "Subject name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  courseImageUrl: z
    .url({ message: "Must be a valid URL." })
    .optional()
    .or(z.literal("")),
  mentorId: z.string().min(1, { message: "Mentor is required." }),
});

type SubjectFormValues = z.infer<typeof subjectFormSchema>;

export default function CreateSubjectPage() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { toast } = useToast();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoadingMentors, setIsLoadingMentors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      courseImageUrl: "",
      mentorId: "",
    },
  });

  useEffect(() => {
    const loadMentors = async () => {
      try {
        setIsLoadingMentors(true);
        const token = await getToken({ template: "skillmentor-auth" });
        if (!token) {
          return;
        }

        const response = await getMentors(token, 0, 100);
        setMentors(response.content);
      } catch (error) {
        toast({
          title: "Error Loading Mentors",
          description:
            error instanceof Error ? error.message : "Failed to fetch mentors",
          variant: "destructive",
        });
      } finally {
        setIsLoadingMentors(false);
      }
    };

    loadMentors();
  }, [getToken, toast]);

  const onSubmit = async (data: SubjectFormValues) => {
    try {
      setIsSubmitting(true);
      const token = await getToken({ template: "skillmentor-auth" });
      if (!token) {
        return;
      }

      await createAdminSubject(token, {
        name: data.name,
        description: data.description,
        courseImageUrl: data.courseImageUrl || undefined,
        mentorId: Number(data.mentorId),
      });

      toast({
        title: "Subject Created",
        description: "The subject has been successfully created.",
      });

      navigate("/admin/subjects");
    } catch (error) {
      toast({
        title: "Error Creating Subject",
        description:
          error instanceof Error ? error.message : "Failed to create subject",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Subject</h2>
        <p className="text-muted-foreground mt-2">
          Add a new subject and assign it to an existing mentor.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Details</CardTitle>
          <CardDescription>
            Fill in the details below to create a new subject.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
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
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide details about the subject..."
                        className="min-h-28 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
                control={form.control}
                name="mentorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mentor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingMentors}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingMentors
                                ? "Loading mentors..."
                                : "Select a mentor"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mentors.map((mentor) => (
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
              <div className="flex justify-end">
                <Button type="submit">
                  {isSubmitting ? "Creating..." : "Create Subject"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
