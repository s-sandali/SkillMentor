import { Outlet, Navigate, Link, useLocation } from "react-router";
import { useUser, UserButton } from "@clerk/clerk-react";
import { BookOpen, Users, Calendar, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Subjects",
    href: "/admin/subjects",
    icon: BookOpen,
  },
  {
    title: "Mentors",
    href: "/admin/mentors",
    icon: Users,
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: Calendar,
  },
];

export default function AdminLayout() {
  const { user, isLoaded } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Check role from publicMetadata
  const role = user?.publicMetadata?.role as string | undefined;

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-muted/40 text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span>SkillMentor Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium gap-1">
            {sidebarNavItems.map((item, index) => {
              const isActive = location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href + "/"));
              return (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    isActive ? "bg-muted text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <Link to="/dashboard">
             <Button variant="outline" className="w-full justify-start gap-2">
               <LogOut className="h-4 w-4" />
               Exit Admin
             </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        
        <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6 text-foreground">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
