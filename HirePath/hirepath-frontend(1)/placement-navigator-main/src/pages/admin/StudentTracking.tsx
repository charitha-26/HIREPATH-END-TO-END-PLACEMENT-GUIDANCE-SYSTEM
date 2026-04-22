import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppLayout } from "@/components/layout/AppLayout";
import { getAdminApplications, updateAdminApplicationStatus } from "@/services/applicationService";

interface Application {
  id: number;
  companyName: string;
  role: string;
  status: string;
  appliedDate: string;
  student: {
    id: number;
    name: string;
    email?: string;
    collegeId?: string;
    batch?: string;
    cgpa?: number;
    branch: string;
    resumePath?: string;
  };
}

const StudentTracking = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");

  useEffect(() => {
    getAdminApplications().then(setApplications);
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await updateAdminApplicationStatus(id, status);

    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status } : app
      )
    );
  };

  const filtered = applications.filter((a) => {
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchBranch =
      branchFilter === "all" || a.student.branch === branchFilter;
    return matchStatus && matchBranch;
  });

  const statusColor: Record<string, string> = {
    Applied: "bg-accent/20 text-accent border-accent/30",
    Shortlisted: "bg-warning/20 text-warning border-warning/30",
    Selected: "bg-success/20 text-success border-success/30",
    Rejected: "bg-destructive/20 text-destructive border-destructive/30",
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Student Tracking</h1>
          <p className="text-muted-foreground">
            Track applications and placement status
          </p>
        </div>

        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Shortlisted">Shortlisted</SelectItem>
              <SelectItem value="Selected">Selected</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Branch" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="ECE">ECE</SelectItem>
              <SelectItem value="EEE">EEE</SelectItem>
              <SelectItem value="AI&ML">AI & ML</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="glass-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead>Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.student.name}</TableCell>
                    <TableCell>{a.student.branch}</TableCell>
                    <TableCell>{a.companyName}</TableCell>
                    <TableCell>{a.role}</TableCell>
                    <TableCell>
                      {new Date(a.appliedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor[a.status]}>
                        {a.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <p>{a.student.email || "-"}</p>
                        <p className="text-muted-foreground">ID: {a.student.collegeId || "-"}</p>
                        <p className="text-muted-foreground">Batch: {a.student.batch || "-"}</p>
                        <p className="text-muted-foreground">CGPA: {a.student.cgpa ?? "-"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {a.student.resumePath ? (
                        <a
                          href={`http://localhost:8080/api/users/${a.student.id}/resume`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline text-sm"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">No resume</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={a.status}
                        onValueChange={(value) =>
                          updateStatus(a.id, value)
                        }
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Applied">Applied</SelectItem>
                          <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="Selected">Selected</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default StudentTracking;
