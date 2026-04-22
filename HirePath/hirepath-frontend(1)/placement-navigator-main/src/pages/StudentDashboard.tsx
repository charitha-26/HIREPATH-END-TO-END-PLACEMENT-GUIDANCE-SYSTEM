import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CalendarDays, Trophy, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";

interface Student {
  id: number;
  name: string;
}

interface Application {
  id: number;
  companyName: string;
  role: string;
  status: string;
}

interface Drive {
  id: number;
  companyName: string;
  role: string;
  date: string;
  deadline: string;
  status: string;
}

const StudentDashboard = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [drives, setDrives] = useState<Drive[]>([]);

  // 🔥 REAL Logged In User
  const storedUser = localStorage.getItem("user");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const loggedInStudentId = loggedInUser?.id;

  useEffect(() => {
    if (!loggedInStudentId) return;

    axios.get(`http://localhost:8080/api/users/${loggedInStudentId}`)
      .then(res => setStudent(res.data));

    axios.get(`http://localhost:8080/api/applications/student/${loggedInStudentId}`)
      .then(res => setApplications(res.data));

    axios.get("http://localhost:8080/api/drives")
      .then(res => setDrives(res.data));
  }, [loggedInStudentId]);

  const upcomingDrives = drives
    .filter(d => d.status === "upcoming")
    .slice(0, 4);

  const statusColor: Record<string, string> = {
    Applied: "bg-accent/20 text-accent border-accent/30",
    Shortlisted: "bg-warning/20 text-warning border-warning/30",
    Selected: "bg-success/20 text-success border-success/30",
    Rejected: "bg-destructive/20 text-destructive border-destructive/30",
  };

  const stats = [
    {
      label: "Upcoming Drives",
      value: upcomingDrives.length,
      icon: CalendarDays,
      color: "text-accent"
    },
    {
      label: "Applications",
      value: applications.length,
      icon: Briefcase,
      color: "text-primary"
    },
    {
      label: "Shortlisted",
      value: applications.filter(a => a.status === "Shortlisted").length,
      icon: Trophy,
      color: "text-warning"
    },
    {
      label: "Offers",
      value: applications.filter(a => a.status === "Selected").length,
      icon: Trophy,
      color: "text-success"
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-4xl font-extrabold">
            Welcome back, {student?.name || "Student"}!
          </h1>
          <p className="mt-2 text-xl font-medium text-muted-foreground">
            Here's your placement overview
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="glass-card hover:border-primary/30 transition-colors">
              <CardContent className="flex items-center gap-5 p-6">
                <div className={`rounded-xl bg-secondary p-4 ${s.color}`}>
                  <s.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-4xl font-extrabold">{s.value}</p>
                  <p className="text-lg font-medium text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Upcoming Drives */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">Upcoming Drives</CardTitle>
              <Link to="/calendar" className="flex items-center gap-1 text-lg font-bold text-primary hover:underline">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDrives.map((d) => {
                const daysLeft = Math.ceil(
                  (new Date(d.deadline).getTime() - Date.now()) / 86400000
                );

                return (
                  <div key={d.id} className="flex items-center justify-between rounded-lg bg-secondary/50 p-4 hover:bg-secondary transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-primary text-base font-bold text-primary-foreground">
                        {d.companyName[0]}
                      </div>
                      <div>
                        <p className="text-lg font-bold">{d.companyName}</p>
                        <p className="text-base text-muted-foreground">{d.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">
                        {new Date(d.date).toLocaleDateString()}
                      </p>
                      {daysLeft > 0 && daysLeft <= 3 && (
                        <Badge variant="outline" className="mt-1 border-destructive/30 bg-destructive/20 text-sm text-destructive">
                          <Clock className="mr-1 h-4 w-4" />
                          {daysLeft}d left
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* My Applications */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl">My Applications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {applications.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-base font-bold">
                      {a.companyName[0]}
                    </div>
                    <div>
                      <p className="text-lg font-bold">{a.companyName}</p>
                      <p className="text-base text-muted-foreground">{a.role}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={statusColor[a.status]}>
                    {a.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;
