import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRole } from "@/contexts/RoleContext";
import { applyToTraining, getStudentTrainings, StudentTraining } from "@/services/trainingService";

const TrainingsPage = () => {
  const { user } = useRole();
  const [trainings, setTrainings] = useState<StudentTraining[]>([]);
  const [applyingId, setApplyingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    getStudentTrainings(user.id)
      .then(setTrainings)
      .catch(() => setTrainings([]));
  }, [user]);

  const handleApply = async (studentTrainingId: number) => {
    if (!user) {
      return;
    }

    setApplyingId(studentTrainingId);

    try {
      const updated = await applyToTraining(studentTrainingId, user.id);
      setTrainings((current) =>
        current.map((item) => (item.id === studentTrainingId ? updated : item))
      );
    } catch (error) {
      console.error("Failed to apply to training", error);
      alert("Unable to apply for this training right now.");
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Trainings</h1>
          <p className="text-muted-foreground">Track assigned trainings and apply when you're ready.</p>
        </div>

        {trainings.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <p>No training assigned yet.</p>
            </CardContent>
          </Card>
        )}

        {trainings.map((training) => {
          const isApplied = training.applicationStatus === "APPLIED";
          const isApplying = applyingId === training.id;

          return (
            <Card key={training.id} className="glass-card">
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-3">
                  <span>{training.training.platform}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline">Phase {training.phase}</Badge>
                    <Badge variant={isApplied ? "default" : "secondary"}>
                      {isApplied ? "Applied" : "Assigned"}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {training.training.description && (
                  <p className="text-sm text-muted-foreground">{training.training.description}</p>
                )}

                <p className="text-sm text-muted-foreground">Score: {training.score}</p>
                <p className="text-sm text-muted-foreground">Rank: #{training.studentRank}</p>

                <Button
                  onClick={() => handleApply(training.id)}
                  disabled={isApplied || isApplying}
                  className="gradient-primary text-primary-foreground"
                >
                  {isApplied ? "Applied" : isApplying ? "Applying..." : "Apply Now"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default TrainingsPage;
