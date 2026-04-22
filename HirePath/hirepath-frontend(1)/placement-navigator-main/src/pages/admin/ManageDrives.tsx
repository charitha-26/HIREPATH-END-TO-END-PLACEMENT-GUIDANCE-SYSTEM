import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

interface Drive {
  id: number;
  companyName: string;
  role: string;
  date: string;
  deadline: string;
  minCgpa: number;
  branches: string;
  status: string;
  applicationFormLink?: string;
  registrationLink?: string;
  applicationInstructions?: string;
}

const ManageDrives = () => {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [open, setOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState<Drive | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    date: "",
    deadline: "",
    minCgpa: "",
    branches: "",
    applicationFormLink: "",
    registrationLink: "",
    applicationInstructions: "",
  });

  // 🔹 Fetch Drives
  const fetchDrives = () => {
    axios.get("http://localhost:8080/api/drives")
      .then(res => setDrives(res.data));
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  // 🔹 Add Drive
  const handleAddDrive = async () => {
    await axios.post("http://localhost:8080/api/admin/drive", {
      companyName: formData.companyName,
      role: formData.role,
      date: formData.date,
      deadline: formData.deadline,
      minCgpa: parseFloat(formData.minCgpa),
      branches: formData.branches,
      applicationFormLink: formData.applicationFormLink,
      registrationLink: formData.registrationLink,
      applicationInstructions: formData.applicationInstructions,
    });

    resetForm();
    fetchDrives();
  };

  // 🔹 Update Drive
  const handleUpdateDrive = async () => {
    if (!editingDrive) return;

    await axios.put(
      `http://localhost:8080/api/admin/drive/${editingDrive.id}`,
      {
        companyName: formData.companyName,
        role: formData.role,
        date: formData.date,
        deadline: formData.deadline,
        minCgpa: parseFloat(formData.minCgpa),
        branches: formData.branches,
        status: editingDrive.status,
        applicationFormLink: formData.applicationFormLink,
        registrationLink: formData.registrationLink,
        applicationInstructions: formData.applicationInstructions,
      }
    );

    resetForm();
    fetchDrives();
  };

  // 🔹 Delete Drive
  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:8080/api/admin/drive/${id}`);
    fetchDrives();
  };

  // 🔹 Reset
  const resetForm = () => {
    setOpen(false);
    setEditingDrive(null);
    setFormData({
      companyName: "",
      role: "",
      date: "",
      deadline: "",
      minCgpa: "",
      branches: "",
      applicationFormLink: "",
      registrationLink: "",
      applicationInstructions: "",
    });
  };

  const statusColor: Record<string, string> = {
    upcoming: "bg-accent/20 text-accent",
    ongoing: "bg-warning/20 text-warning",
    completed: "bg-success/20 text-success",
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manage Drives</h1>
            <p className="text-muted-foreground">
              Schedule and manage placement drives
            </p>
          </div>

          <Dialog
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              if (!value) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-1" /> Add Drive
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>
                  {editingDrive ? "Edit Drive" : "Schedule Drive"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Drive Date</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Deadline</Label>
                    <Input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Min CGPA</Label>
                    <Input
                      type="number"
                      value={formData.minCgpa}
                      onChange={(e) =>
                        setFormData({ ...formData, minCgpa: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Branches</Label>
                    <Input
                      value={formData.branches}
                      onChange={(e) =>
                        setFormData({ ...formData, branches: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Application Form Link</Label>
                  <Input
                    placeholder="https://forms.gle/..."
                    value={formData.applicationFormLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        applicationFormLink: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Registration Link</Label>
                  <Input
                    placeholder="https://forms.gle/... or external registration URL"
                    value={formData.registrationLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registrationLink: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Important Instructions</Label>
                  <Input
                    placeholder="Carry resume, submit before deadline, etc."
                    value={formData.applicationInstructions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        applicationInstructions: e.target.value,
                      })
                    }
                  />
                </div>

                <Button
                  onClick={editingDrive ? handleUpdateDrive : handleAddDrive}
                  className="w-full gradient-primary text-primary-foreground"
                >
                  {editingDrive ? "Update Drive" : "Schedule Drive"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="glass-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Min CGPA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {drives.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>{d.companyName}</TableCell>
                    <TableCell>{d.role}</TableCell>
                    <TableCell>{new Date(d.date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(d.deadline).toLocaleDateString()}</TableCell>
                    <TableCell>{d.minCgpa}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor[d.status]}>
                        {d.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingDrive(d);
                          setFormData({
                            companyName: d.companyName,
                            role: d.role,
                            date: d.date,
                            deadline: d.deadline,
                            minCgpa: String(d.minCgpa),
                            branches: d.branches,
                            applicationFormLink: d.applicationFormLink || "",
                            registrationLink: d.registrationLink || "",
                            applicationInstructions: d.applicationInstructions || "",
                          });
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(d.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

export default ManageDrives;