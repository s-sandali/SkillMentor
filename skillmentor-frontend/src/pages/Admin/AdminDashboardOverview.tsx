import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, CalendarCheck, Loader2, UserPlus, Calendar } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { getAdminDashboard } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Activity } from "@/types";
import RecentActivity from "@/components/RecentActivity";

export default function AdminDashboardOverview() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    subjects: 0,
    mentors: 0,
    bookings: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const token = await getToken({ template: "skillmentor-auth" });
        if (!token) {
          throw new Error("You must be signed in as an admin to view dashboard stats.");
        }

        const dashboardData = await getAdminDashboard(token);

        setStats({
          subjects: dashboardData.totalSubjects,
          mentors: dashboardData.totalMentors,
          bookings: dashboardData.totalBookings,
        });

        setRecentActivities(dashboardData.recentActivities);
      } catch (error) {
        toast({
          title: "Failed to load dashboard",
          description:
            error instanceof Error ? error.message : "Unable to fetch dashboard data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [getToken, toast]);

  return (
    <div className="space-y-8">
      {/* Greeting Section */}
      <section className="mb-6 space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName || "Admin"} 
        </h2>
        <p className="text-muted-foreground text-lg">
          Here's what's happening on SkillMentor today.
        </p>
      </section>

      {/* Stats Section */}
      <section>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <Card className="group flex flex-col relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] border bg-card">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Subjects</CardTitle>
              <div className="p-2 bg-muted rounded-full group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-4 w-4 text-foreground" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 flex flex-col justify-between">
              {loading ? (
                <div className="mb-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="text-4xl font-bold tracking-tighter tabular-nums drop-shadow-sm text-foreground mb-4">
                  {stats.subjects}
                </div>
              )}
              <Button
                variant="outline"
                className="w-full justify-center transition-all duration-300 group-hover:border-primary/50"
                onClick={() => navigate("/admin/subjects/create")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Create Subject
              </Button>
            </CardContent>
          </Card>

          <Card className="group flex flex-col relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] border bg-card">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Mentors</CardTitle>
              <div className="p-2 bg-muted rounded-full group-hover:scale-110 transition-transform duration-300">
                <Users className="h-4 w-4 text-foreground" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 flex flex-col justify-between">
              {loading ? (
                <div className="mb-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="text-4xl font-bold tracking-tighter tabular-nums drop-shadow-sm text-foreground mb-4">
                  {stats.mentors}
                </div>
              )}
              <Button
                variant="outline"
                className="w-full justify-center transition-all duration-300 group-hover:border-primary/50"
                onClick={() => navigate("/admin/mentors/create")}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Mentor
              </Button>
            </CardContent>
          </Card>

          <Card className="group flex flex-col relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] border bg-card">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
              <div className="p-2 bg-muted rounded-full group-hover:scale-110 transition-transform duration-300">
                <CalendarCheck className="h-4 w-4 text-foreground" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 flex flex-col justify-between">
              {loading ? (
                <div className="mb-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="text-4xl font-bold tracking-tighter tabular-nums drop-shadow-sm text-foreground mb-4">
                  {stats.bookings}
                </div>
              )}
              <Button
                variant="outline"
                className="w-full justify-center transition-all duration-300 group-hover:border-primary/50"
                onClick={() => navigate("/admin/bookings")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Bookings
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Activity Section */}
      <RecentActivity activities={recentActivities} />
    </div>
  );
}
