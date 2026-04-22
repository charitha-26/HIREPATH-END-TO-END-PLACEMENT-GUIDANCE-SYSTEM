import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Trash2, Pencil } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

interface Company {
  id: number;
  name: string;
  industry: string;
  minCgpa: number;
  branches: string;
  roles: string;
  packageLpa: string;
  companyProfileLink?: string;
  formLink?: string;
}

const ManageCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    minCgpa: "",
    branches: "",
    roles: "",
    packageLpa: "",
    companyProfileLink: "",
    formLink: "",
  });

  // 🔹 Fetch Companies
  const fetchCompanies = () => {
    axios
      .get("http://localhost:8080/api/companies")
      .then((res) => setCompanies(res.data));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 🔹 Handle Add Company
  const handleAddCompany = async () => {
    await axios.post("http://localhost:8080/api/admin/company", {
      name: formData.name,
      industry: formData.industry,
      minCgpa: parseFloat(formData.minCgpa),
      branches: formData.branches,
      roles: formData.roles,
      packageLpa: formData.packageLpa,
      companyProfileLink: formData.companyProfileLink,
      formLink: formData.formLink,
    });

    resetForm();
    fetchCompanies();
  };

  // 🔹 Handle Update Company
  const handleUpdateCompany = async () => {
    if (!editingCompany) return;

    await axios.put(
      `http://localhost:8080/api/admin/company/${editingCompany.id}`,
      {
        name: formData.name,
        industry: formData.industry,
        minCgpa: parseFloat(formData.minCgpa),
        branches: formData.branches,
        roles: formData.roles,
        packageLpa: formData.packageLpa,
        companyProfileLink: formData.companyProfileLink,
        formLink: formData.formLink,
      }
    );

    resetForm();
    fetchCompanies();
  };

  // 🔹 Handle Delete
  const handleDelete = async (id: number) => {
    await axios.delete(
      `http://localhost:8080/api/admin/company/${id}`
    );
    fetchCompanies();
  };

  // 🔹 Reset Form
  const resetForm = () => {
    setOpen(false);
    setEditingCompany(null);
    setFormData({
      name: "",
      industry: "",
      minCgpa: "",
      branches: "",
      roles: "",
      packageLpa: "",
      companyProfileLink: "",
      formLink: "",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manage Companies</h1>
            <p className="text-muted-foreground">
              Add, edit, or remove companies
            </p>
          </div>

          {/* Add / Edit Company Dialog */}
          <Dialog
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              if (!value) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-1" /> Add Company
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>
                  {editingCompany ? "Edit Company" : "Add Company"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Input
                      value={formData.industry}
                      onChange={(e) =>
                        setFormData({ ...formData, industry: e.target.value })
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
                    <Label>Package (LPA)</Label>
                    <Input
                      value={formData.packageLpa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          packageLpa: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Branches (comma-separated)</Label>
                  <Input
                    value={formData.branches}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branches: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Roles (comma-separated)</Label>
                  <Input
                    value={formData.roles}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        roles: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company Profile Link</Label>
                  <Input
                    placeholder="https://company.com/careers"
                    value={formData.companyProfileLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        companyProfileLink: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Form Link</Label>
                  <Input
                    placeholder="https://forms.gle/..."
                    value={formData.formLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        formLink: e.target.value,
                      })
                    }
                  />
                </div>

                <Button
                  onClick={
                    editingCompany ? handleUpdateCompany : handleAddCompany
                  }
                  className="w-full gradient-primary text-primary-foreground"
                >
                  {editingCompany ? "Update Company" : "Add Company"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Companies Table */}
        <Card className="glass-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Min CGPA</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead className="text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {companies.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      {c.name}
                    </TableCell>
                    <TableCell>{c.industry}</TableCell>
                    <TableCell>{c.minCgpa}</TableCell>
                    <TableCell>{c.roles}</TableCell>
                    <TableCell>₹{c.packageLpa} LPA</TableCell>
                    <TableCell className="text-right">
                      {/* EDIT BUTTON */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingCompany(c);
                          setFormData({
                            name: c.name,
                            industry: c.industry,
                            minCgpa: String(c.minCgpa),
                            branches: c.branches,
                            roles: c.roles,
                            packageLpa: c.packageLpa,
                            companyProfileLink: c.companyProfileLink || "",
                            formLink: c.formLink || "",
                          });
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* DELETE BUTTON */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(c.id)}
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

export default ManageCompanies;