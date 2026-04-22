import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  MessageSquareText,
  GraduationCap,
  BarChart3,
  Users,
  CheckCircle,
  PanelLeftClose,
  PanelLeft,
  Briefcase,
  BookOpen,
  Award,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

const studentNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Drive Calendar", url: "/calendar", icon: CalendarDays },
  { title: "Companies", url: "/companies", icon: Building2 },
  { title: "Trainings", url: "/trainings", icon: BookOpen },
  { title: "Placements", url: "/placements", icon: BarChart3 },
  { title: "Internships", url: "/internships", icon: Briefcase },
  { title: "Experiences", url: "/experiences", icon: MessageSquareText },
  { title: "Alumni", url: "/alumni", icon: GraduationCap },
];

const adminNav = [
  { title: "Dashboard", url: "/admin", icon: BarChart3 },
  { title: "Companies", url: "/admin/companies", icon: Building2 },
  { title: "Drives", url: "/admin/drives", icon: CalendarDays },
  { title: "Students", url: "/admin/students", icon: Users },
  { title: "Alumni", url: "/admin/alumni", icon: GraduationCap },
  { title: "Trainings", url: "/admin/trainings", icon: Award },
  { title: "Placements", url: "/admin/placements", icon: BarChart3 },
  { title: "Internships", url: "/internships", icon: Briefcase },
  { title: "Approve Exp.", url: "/admin/experiences", icon: CheckCircle },
];

export function AppSidebar() {
  const { role } = useRole();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const nav = role === "student" ? studentNav : adminNav;

  return (
    <aside
      className={cn(
        "min-h-[calc(100vh-4.5rem)] sticky top-[4.5rem] self-start border-r border-sidebar-border bg-sidebar flex flex-col transition-all duration-300 shadow-[10px_0_30px_-24px_rgba(0,0,0,0.45)]",
        collapsed ? "w-16" : "w-72"
      )}
    >
      <div className="flex-1 py-5">
        <nav className="space-y-2 bg-sidebar px-3 pb-5">
          {nav.map((item) => {
            const active = location.pathname === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                className={cn(
                  "group flex items-center gap-4 rounded-xl px-4 py-4 text-[1.28rem] font-bold transition-all duration-200",
                  active
                    ? "border-l-4 border-sidebar-primary pl-2 text-sidebar-primary"
                    : "text-sidebar-foreground tracking-wide hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex h-13 w-13 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                    active ? "bg-white/5" : "bg-white/5 group-hover:bg-white/10"
                  )}
                >
                  <item.icon className="h-6 w-6 shrink-0" />
                </span>
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="border-t border-sidebar-border bg-sidebar p-3 text-base font-semibold tracking-wide text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        {collapsed ? <PanelLeft className="mx-auto h-6 w-6" /> : <PanelLeftClose className="mx-auto h-6 w-6" />}
      </button>
    </aside>
  );
}
