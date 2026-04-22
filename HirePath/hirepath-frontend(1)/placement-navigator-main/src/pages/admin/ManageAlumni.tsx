import { useEffect, useState } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

interface Alumni {
  id: number;
  name: string;
  graduationYear: string;
  companyName: string;
  linkedinUrl?: string;
}

const emptyForm = {
  name: "",
  graduationYear: "",
  companyName: "",
  linkedinUrl: "",
};

const getLinkedInHref = (linkedinUrl?: string) => {
  if (!linkedinUrl) {
    return "";
  }

  return /^https?:\/\//i.test(linkedinUrl) ? linkedinUrl : `https://${linkedinUrl}`;
};

const ManageAlumni = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [form, setForm] = useState(emptyForm);

  const fetchAlumni = () => {
    axios.get("http://localhost:8080/api/alumni").then((res) => setAlumni(res.data));
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const addAlumni = async () => {
    await axios.post("http://localhost:8080/api/alumni", form);
    setForm(emptyForm);
    fetchAlumni();
  };

  const removeAlumni = async (id: number) => {
    await axios.delete(`http://localhost:8080/api/alumni/${id}`);
    fetchAlumni();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Alumni</h1>
          <p className="text-muted-foreground">Add, view, and delete alumni contacts</p>
        </div>

        <Card className="glass-card">
          <CardContent className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Graduation Year</Label>
              <Input value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
            </div>
            <Button className="md:col-span-2" onClick={addAlumni}>
              Add Alumni
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {alumni.map((a) => (
            <Card key={a.id} className="glass-card">
              <CardContent className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-sm text-muted-foreground">{a.companyName}</p>
                  <p className="text-xs text-muted-foreground">Class of {a.graduationYear}</p>
                  {a.linkedinUrl && (
                    <a
                      href={getLinkedInHref(a.linkedinUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-xs font-medium text-primary underline underline-offset-2"
                    >
                      {a.linkedinUrl}
                    </a>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeAlumni(a.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ManageAlumni;
