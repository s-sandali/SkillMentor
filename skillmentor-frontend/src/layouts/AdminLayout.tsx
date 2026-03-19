import { useState } from "react";
import { Outlet, Navigate, Link, useLocation } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { BookOpen, Users, Calendar, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  return (
    <nav className="grid items-start px-4 text-sm font-medium gap-1">
      {sidebarNavItems.map((item, index) => {
        const isActive =
          location.pathname === item.href ||
          (item.href !== "/admin" && location.pathname.startsWith(item.href + "/"));
        return (
          <Link
            key={index}
            to={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              isActive ? "bg-muted text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout() {
  const { user, isLoaded } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const role = user?.publicMetadata?.role as string | undefined;

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-muted/40 text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span>SkillMentor Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <SidebarNav />
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
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-14 items-center border-b px-6">
                <Link
                  to="/"
                  className="flex items-center gap-2 font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>SkillMentor Admin</span>
                </Link>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
              </div>
              <div className="p-4 border-t">
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <LogOut className="h-4 w-4" />
                    Exit Admin
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-semibold">SkillMentor Admin</span>
        </header>

        <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6 text-foreground">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
