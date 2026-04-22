import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

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
}

const ApproveExperiences = () => {
  const [pendingExperiences, setPendingExperiences] = useState<Experience[]>([]);
  const [approvedExperiences, setApprovedExperiences] = useState<Experience[]>([]);
  const { toast } = useToast();

  const fetchExperiences = () => {
    Promise.all([
      axios.get("http://localhost:8080/api/admin/experiences?status=PENDING"),
      axios.get("http://localhost:8080/api/admin/experiences?status=APPROVED"),
    ]).then(([pendingRes, approvedRes]) => {
      setPendingExperiences(pendingRes.data);
      setApprovedExperiences(approvedRes.data);
    });
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleAction = async (
    id: number,
    action: "approve" | "reject"
  ) => {
    try {
      if (action === "approve") {
        await axios.put(
          `http://localhost:8080/api/experiences/${id}/approve`
        );
      } else {
        await axios.delete(
          `http://localhost:8080/api/admin/experiences/${id}`
        );
      }

      fetchExperiences();

      toast({
        title: action === "approve" ? "Experience Approved" : "Experience Deleted",
        description: action === "approve"
          ? "The experience has been approved."
          : "The experience has been deleted.",
      });

    } catch {
      toast({
        title: "Action Failed",
        description: "Something went wrong.",
        variant: "destructive"
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-bold">
            Approve Experiences
          </h1>
          <p className="text-muted-foreground">
            Review submitted interview experiences
          </p>
        </div>

        <h2 className="text-lg font-semibold">Pending</h2>
        {pendingExperiences.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-success mb-3" />
              <p className="text-lg font-medium">
                All caught up!
              </p>
              <p className="text-sm text-muted-foreground">
                No pending experiences to review.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingExperiences.map((exp) => {
              const rounds: Round[] = JSON.parse(
                exp.roundsJson
              );

              return (
                <Card key={exp.id} className="glass-card">
                  <CardContent className="p-5">

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {exp.companyName} — {exp.role}
                          </h3>
                          <Badge
                            variant="outline"
                            className="bg-warning/20 text-warning border-warning/30"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          by {exp.studentName} • {exp.year}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-success hover:bg-success/90 text-success-foreground"
                          onClick={() =>
                            handleAction(exp.id, "approve")
                          }
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/30"
                          onClick={() =>
                            handleAction(exp.id, "reject")
                          }
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {rounds.map((r, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-secondary/50"
                        >
                          <span className="text-sm font-medium">
                            {r.name}
                          </span>

                          <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                            {r.questions.map((q, j) => (
                              <li key={j}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <p className="text-sm mt-3 text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Tips:
                      </span>{" "}
                      {exp.tips}
                    </p>

                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <h2 className="text-lg font-semibold pt-3">Approved</h2>
        {approvedExperiences.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-6 text-sm text-muted-foreground text-center">
              No approved experiences yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {approvedExperiences.map((exp) => {
              const rounds: Round[] = JSON.parse(exp.roundsJson);
              return (
                <Card key={exp.id} className="glass-card">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {exp.companyName} — {exp.role}
                          </h3>
                          <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                            Approved
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          by {exp.studentName} • {exp.year}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive border-destructive/30"
                        onClick={() => handleAction(exp.id, "reject")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {rounds.map((r, i) => (
                        <div key={i} className="p-3 rounded-lg bg-secondary/50">
                          <span className="text-sm font-medium">{r.name}</span>
                          <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                            {r.questions.map((q, j) => (
                              <li key={j}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default ApproveExperiences;