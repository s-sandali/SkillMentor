import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, UserPlus, BookOpen } from "lucide-react";
import type { Activity } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface RecentActivityProps {
  activities: Activity[];
}

// Icon mapping for activity types
const activityIcons = {
  booking: Calendar,
  payment: CheckCircle,
  mentor: UserPlus,
  subject: BookOpen,
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <section>
      <Card className="group relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] border bg-card">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl font-bold tracking-tight">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          {activities.length === 0 ? (
            <p className="text-muted-foreground text-sm">No recent activity to display.</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const IconComponent = activityIcons[activity.type];
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-muted/50 group/item"
                  >
                    <div className="p-2 bg-muted rounded-full group-hover/item:scale-110 transition-transform duration-300">
                      <IconComponent className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-relaxed">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
