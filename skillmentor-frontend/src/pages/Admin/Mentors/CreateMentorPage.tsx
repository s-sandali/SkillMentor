import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CheckCircle2, Mail, Briefcase, CalendarDays } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { createAdminMentor } from "@/lib/api";
import type { CreateMentorRequest, MentorResponse } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const currentYear = new Date().getFullYear();

const createMentorSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(100),
  lastName: z.string().trim().min(1, "Last name is required.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(100),
  phoneNumber: z.string().trim().max(20).optional().or(z.literal("")),
  title: z.string().trim().max(100).optional().or(z.literal("")),
  profession: z.string().trim().min(1, "Profession is required.").max(100),
  company: z.string().trim().min(1, "Company is required.").max(100),
  experienceYears: z
    .number()
    .int("Experience years must be a whole number.")
    .min(0, "Experience years must be at least 0.")
    .max(80, "Experience years must not exceed 80."),
  bio: z.string().trim().min(1, "Bio is required.").max(1000),
  profileImageUrl: z
    .string()
    .trim()
    .url("Enter a valid image URL.")
    .optional()
    .or(z.literal("")),
  isCertified: z.enum(["true", "false"]),
  startYear: z
    .string()
    .regex(/^\d{4}$/, "Start year must be a valid 4-digit year.")
    .refine(
      (value) => Number(value) >= 1950 && Number(value) <= currentYear,
      `Start year must be between 1950 and ${currentYear}.`,
    ),
});

type CreateMentorFormValues = z.infer<typeof createMentorSchema>;

function buildMentorPayload(values: CreateMentorFormValues): CreateMentorRequest {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    phoneNumber: values.phoneNumber?.trim() || undefined,
    title: values.title?.trim() || undefined,
    profession: values.profession.trim(),
    company: values.company.trim(),
    experienceYears: values.experienceYears,
    bio: values.bio.trim(),
    profileImageUrl: values.profileImageUrl?.trim() || undefined,
    isCertified: values.isCertified === "true",
    startYear: values.startYear,
  };
}

export default function CreateMentorPage() {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdMentor, setCreatedMentor] = useState<MentorResponse | null>(null);
  const profileApiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

  const form = useForm<CreateMentorFormValues>({
    resolver: zodResolver(createMentorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      title: "",
      profession: "",
      company: "",
      experienceYears: 0,
      bio: "",
      profileImageUrl: "",
      isCertified: "false",
      startYear: String(currentYear),
    },
  });

  const watchedValues = form.watch();
  const mentorPreview = buildMentorPayload(watchedValues);
  const mentorName =
    `${mentorPreview.firstName || "New"} ${mentorPreview.lastName || "Mentor"}`.trim();

  const onSubmit = async (values: CreateMentorFormValues) => {
    try {
      setIsSubmitting(true);
      const token = await getToken({ template: "skillmentor-auth" });

      if (!token) {
        throw new Error("You must be signed in to create a mentor.");
      }

      const response = await createAdminMentor(token, buildMentorPayload(values));
      setCreatedMentor(response);
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        title: "",
        profession: "",
        company: "",
        experienceYears: 0,
        bio: "",
        profileImageUrl: "",
        isCertified: "false",
        startYear: String(currentYear),
      });

      toast({
        title: "Mentor created",
        description: `${response.firstName} ${response.lastName} is now available for assignment.`,
      });
    } catch (error) {
      toast({
        title: "Failed to create mentor",
        description:
          error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Mentor</h2>
          <p className="mt-2 text-muted-foreground">
            Add a mentor profile that admins can assign to subjects and expose on the
            platform.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/mentors">Back to mentors</Link>
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Mentor Details</CardTitle>
            <CardDescription>
              Fill out the profile fields below. Validation follows the backend
              contract for the admin mentor endpoint.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Ava" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Perera" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="mentor@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+94 77 123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Senior Software Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <FormControl>
                          <Input placeholder="Software Engineering" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="StemLink Labs" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experienceYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Years</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={80}
                            value={field.value}
                            onChange={(event) =>
                              field.onChange(event.target.value === "" ? 0 : Number(event.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profileImageUrl"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Profile Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/mentor-photo.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isCertified"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Is Certified</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select certification status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Certified</SelectItem>
                            <SelectItem value="false">Not Certified</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Year</FormLabel>
                        <FormControl>
                          <Input inputMode="numeric" placeholder="2021" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the mentor's expertise, teaching style, and strengths."
                            className="min-h-36 resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating mentor..." : "Create Mentor"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/40">
              <CardTitle>Mentor Card Preview</CardTitle>
              <CardDescription>
                Live preview of how the mentor profile reads before submission.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <div className="flex items-start gap-4">
                {mentorPreview.profileImageUrl ? (
                  <img
                    src={mentorPreview.profileImageUrl}
                    alt={mentorName}
                    className="size-20 rounded-2xl object-cover object-top shadow-sm"
                  />
                ) : (
                  <div className="flex size-20 items-center justify-center rounded-2xl bg-muted text-xl font-semibold">
                    {mentorName.charAt(0)}
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{mentorName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {mentorPreview.title || "Mentor title"}
                  </p>
                  <p className="text-sm">{mentorPreview.profession || "Profession"}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-4" />
                  <span>{mentorPreview.email || "mentor@example.com"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="size-4" />
                  <span>{mentorPreview.company || "Company"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4" />
                  <span>
                    {mentorPreview.experienceYears} years experience since{" "}
                    {mentorPreview.startYear}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>
                    {mentorPreview.isCertified ? "Certified mentor" : "Certification not listed"}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {mentorPreview.bio || "The mentor bio preview appears here as you type."}
                </p>
              </div>
            </CardContent>
          </Card>

          {createdMentor && (
            <Card className="border-emerald-200 bg-emerald-50/60">
              <CardHeader>
                <CardTitle>Mentor Created</CardTitle>
                <CardDescription>
                  The mentor profile was saved successfully.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <a
                    href={`${profileApiBaseUrl}/api/v1/mentors/${createdMentor.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open mentor profile
                  </a>
                </Button>
                <Button asChild>
                  <Link to="/admin/mentors">Go to mentors</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
