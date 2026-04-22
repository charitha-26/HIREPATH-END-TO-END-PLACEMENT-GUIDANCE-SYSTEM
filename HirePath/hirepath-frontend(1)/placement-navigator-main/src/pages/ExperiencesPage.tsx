import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Search, Plus, Star } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";

interface Round {
  name: string;
  difficulty: string;
  questions: string[];
}

interface Experience {
  id: number;
  companyName: string;
  role: string;
  studentName: string;
  year: string;
  roundsJson: string;
  tips: string;
  status: "PENDING" | "APPROVED";
}

const ExperiencesPage = () => {
  const [search, setSearch] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [myExperiences, setMyExperiences] = useState<Experience[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [roundsText, setRoundsText] = useState("");
  const [tips, setTips] = useState("");
  const [editingExperienceId, setEditingExperienceId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const storedUser = localStorage.getItem("user");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  const fetchApprovedExperiences = () => {
    axios
      .get("http://localhost:8080/api/experiences")
      .then((res) => setExperiences(res.data));
  };

  const fetchMyExperiences = () => {
    if (!loggedInUser?.id) return;
    axios
      .get(`http://localhost:8080/api/experiences/student/${loggedInUser.id}`)
      .then((res) => setMyExperiences(res.data));
  };

  // 🔥 Fetch approved experiences
  useEffect(() => {
    fetchApprovedExperiences();
    fetchMyExperiences();
  }, []);

  const filtered = experiences.filter((e) =>
    e.companyName.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  const diffColor: Record<string, string> = {
    Easy: "bg-success/20 text-success border-success/30",
    Medium: "bg-warning/20 text-warning border-warning/30",
    Hard: "bg-destructive/20 text-destructive border-destructive/30"
  };
  const myStatusColor: Record<string, string> = {
    PENDING: "bg-warning/20 text-warning border-warning/30",
    APPROVED: "bg-success/20 text-success border-success/30",
  };

  // 🔥 Submit experience
  const handleSubmit = async () => {
    if (!loggedInUser) {
      alert("Please login first");
      return;
    }

    try {
      const roundsArray: Round[] = [
        {
          name: "Interview",
          difficulty: "Medium",
          questions: roundsText.split("\n")
        }
      ];

      if (editingExperienceId) {
        await axios.put(
          `http://localhost:8080/api/experiences/${editingExperienceId}`,
          {
            companyName,
            role,
            studentName: loggedInUser.name,
            year: "2026",
            roundsJson: JSON.stringify(roundsArray),
            tips
          },
          {
            params: { studentId: loggedInUser.id }
          }
        );
        toast({ title: "Experience updated and sent for re-approval" });
      } else {
        await axios.post(
          "http://localhost:8080/api/experiences",
          {
            companyName,
            role,
            studentName: loggedInUser.name,
            year: "2026",
            roundsJson: JSON.stringify(roundsArray),
            tips
          },
          {
            params: { studentId: loggedInUser.id }
          }
        );
        toast({ title: "Submitted for approval!" });
      }

      setCompanyName("");
      setRole("");
      setRoundsText("");
      setTips("");
      setEditingExperienceId(null);
      setDialogOpen(false);
      fetchMyExperiences();
      fetchApprovedExperiences();
    } catch {
      toast({ title: "Submission failed", variant: "destructive" });
    }
  };

  const startEditExperience = (exp: Experience) => {
    setEditingExperienceId(exp.id);
    setCompanyName(exp.companyName);
    setRole(exp.role);
    const rounds: Round[] = JSON.parse(exp.roundsJson || "[]");
    setRoundsText((rounds[0]?.questions || []).join("\n"));
    setTips(exp.tips || "");
    setDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Interview Experiences</h1>
            <p className="text-muted-foreground">
              Learn from peers' placement journeys
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-1" /> {editingExperienceId ? "Edit Experience" : "Share Experience"}
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-card border-border max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingExperienceId ? "Edit Your Experience" : "Submit Interview Experience"}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="SDE-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rounds & Questions</Label>
                  <Textarea
                    value={roundsText}
                    onChange={(e) => setRoundsText(e.target.value)}
                    placeholder="Write each question on new line"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tips & Advice</Label>
                  <Textarea
                    value={tips}
                    onChange={(e) => setTips(e.target.value)}
                    placeholder="Any tips for future candidates..."
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full gradient-primary text-primary-foreground"
                >
                  {editingExperienceId ? "Update Experience" : "Submit for Approval"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your experience will be reviewed by admin before publishing.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search experiences..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-4">
          {filtered.map((exp) => {
            const rounds: Round[] = JSON.parse(exp.roundsJson);

            return (
              <Card key={exp.id} className="glass-card">
                <CardContent className="p-5">

                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {exp.companyName} — {exp.role}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        by {exp.studentName} • {exp.year}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {rounds.map((r, i) => (
                      <div key={i} className="p-3 rounded-lg bg-secondary/50">

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {r.name}
                          </span>
                          <Badge
                            variant="outline"
                            className={diffColor[r.difficulty]}
                          >
                            {r.difficulty}
                          </Badge>
                        </div>

                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {r.questions.map((q, j) => (
                            <li key={j}>{q}</li>
                          ))}
                        </ul>

                      </div>
                    ))}
                  </div>

                  <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-sm">
                      <Star className="h-4 w-4 inline mr-1 text-warning" />
                      <span className="font-medium">Tips: </span>
                      {exp.tips}
                    </p>
                  </div>

                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="glass-card">
          <CardContent className="p-5">
            <h3 className="text-lg font-semibold mb-3">My Experiences</h3>
            {myExperiences.length === 0 ? (
              <p className="text-sm text-muted-foreground">You have not submitted any experience yet.</p>
            ) : (
              <div className="space-y-3">
                {myExperiences.map((exp) => (
                  <div key={exp.id} className="p-3 rounded-lg bg-secondary/40 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{exp.companyName} - {exp.role}</p>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className={myStatusColor[exp.status] || "bg-muted text-muted-foreground border-border"}
                        >
                          {exp.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => startEditExperience(exp)}>
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
};

export default ExperiencesPage;