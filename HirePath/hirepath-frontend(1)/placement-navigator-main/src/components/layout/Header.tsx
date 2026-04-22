import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell, LogOut, Moon, Sun } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  urgency: "low" | "medium" | "high";
}

export function Header() {
  const { role, user, logout } = useRole();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (role === "student" && user?.id) {
          const [appsRes, drivesRes] = await Promise.all([
            axios.get(`http://localhost:8080/api/applications/student/${user.id}`),
            axios.get("http://localhost:8080/api/drives"),
          ]);

          const appNotifications: NotificationItem[] = appsRes.data.map((app: any) => ({
            id: `app-${app.id}`,
            title: "Application Update",
            message: `${app.companyName}: ${app.status}`,
            time: "recent",
            read: app.status === "Applied",
            urgency: app.status === "Rejected" ? "high" : app.status === "Shortlisted" ? "medium" : "low",
          }));

          const deadlineNotifications: NotificationItem[] = drivesRes.data
            .filter((d: any) => d.status !== "completed")
            .slice(0, 3)
            .map((d: any) => ({
              id: `drive-${d.id}`,
              title: `Drive: ${d.companyName}`,
              message: `Role: ${d.role}, deadline ${new Date(d.deadline).toLocaleDateString()}`,
              time: "recent",
              read: true,
              urgency: "medium",
            }));

          setNotifications([...appNotifications, ...deadlineNotifications]);
        } else {
          setNotifications([]);
        }
      } catch {
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, [role, user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : role === "admin" ? "AD" : "ST";

  return (
    <header className="h-[4.5rem] border-b border-border bg-card flex items-center justify-between px-6 md:px-8 sticky top-0 z-30">
      <h1 className="text-2xl font-extrabold text-primary">HirePath</h1>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title="Toggle dark mode"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Notifications */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  {unread}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-card border-border" align="end">
            <div className="p-4 border-b border-border">
              <h3 className="text-base font-bold">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-base text-muted-foreground">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 border-b border-border/50 hover:bg-secondary/60 transition-colors ${!n.read ? "bg-secondary/40" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${n.urgency === "high" ? "bg-destructive" : n.urgency === "medium" ? "bg-warning" : "bg-success"}`} />
                          <span className="text-base font-semibold">{n.title}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
          <LogOut className="h-5 w-5" />
        </Button>

        {/* Profile avatar */}
        <Link to="/profile" title="My Profile">
          <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
