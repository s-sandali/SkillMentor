import { Users, Trophy, BookOpen, ThumbsUp } from "lucide-react";
import type { MentorStats } from "@/types";

interface MentorStatsSectionProps {
  stats: MentorStats;
}

export function MentorStatsSection({ stats }: MentorStatsSectionProps) {
  const items = [
    {
      icon: <Users className="size-6 text-secondary" />,
      value: stats.totalStudents,
      label: "Students Taught",
    },
    {
      icon: <Trophy className="size-6 text-primary" />,
      value: `${stats.yearsExperience}+`,
      label: "Years Experience",
    },
    {
      icon: <BookOpen className="size-6 text-secondary" />,
      value: stats.subjectsCount,
      label: "Subjects",
    },
    {
      icon: <ThumbsUp className="size-6 text-primary" />,
      value: `${stats.positiveReviewPercentage}%`,
      label: "Positive Reviews",
    },
  ];

  return (
    <div className="bg-white border-b border-border">
      <div className="container py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-muted/50 text-center"
            >
              {item.icon}
              <p className="text-2xl font-bold tracking-tight">{item.value}</p>
              <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
