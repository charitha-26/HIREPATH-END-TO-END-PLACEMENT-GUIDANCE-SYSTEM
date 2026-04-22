import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { ExternalLink } from "lucide-react";
import { applyToDrive, getStudentApplications } from "@/services/applicationService";

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

const DriveDetailsPage = () => {
  const { id } = useParams();
  const [drive, setDrive] = useState<Drive | null>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const storedUser = localStorage.getItem("user");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const studentId = loggedInUser?.id;

  useEffect(() => {
    axios.get(`http://localhost:8080/api/drives/${id}`)
      .then(res => setDrive(res.data));

    if (studentId) {
      getStudentApplications(studentId)
        .then(res => {
          const applied = res.some((a) => a.drive?.id === Number(id));
          setAlreadyApplied(applied);
        });
    }
  }, [id, studentId]);

  const handleApply = async () => {
    try {
      if (!studentId || !id) return;
      setIsApplying(true);
      await applyToDrive(studentId, id);
      setAlreadyApplied(true);
    } catch (err: any) {
      alert(err.response?.data || "Cannot apply");
    } finally {
      setIsApplying(false);
    }
  };

  if (!drive) return null;

  const deadlinePassed = new Date(drive.deadline).getTime() < Date.now();
  const canApply =
    !alreadyApplied &&
    !deadlinePassed &&
    (drive.status === "upcoming" || drive.status === "ongoing");

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <Card className="glass-card">
          <CardContent className="p-6 space-y-4">

            <h1 className="text-2xl font-bold">{drive.companyName}</h1>
            <p className="text-muted-foreground">{drive.role}</p>

            <div className="flex gap-3 flex-wrap">
              <Badge>Min CGPA: {drive.minCgpa}</Badge>
              <Badge>{drive.branches}</Badge>
              <Badge>{drive.status}</Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              Drive Date: {new Date(drive.date).toLocaleDateString()}
              <br />
              Deadline: {new Date(drive.deadline).toLocaleDateString()}
            </div>

            {(drive.status === "completed" || deadlinePassed) && (
              <Badge className="bg-muted text-muted-foreground">
                {drive.status === "completed" ? "Drive Completed" : "Deadline Over"}
              </Badge>
            )}

            {canApply && (
              <Button
                onClick={handleApply}
                disabled={isApplying}
                className="gradient-primary text-primary-foreground"
              >
                {isApplying ? "Applying..." : "Apply Now"}
              </Button>
            )}

            {alreadyApplied && (
              <Badge className="bg-success/20 text-success border-success/30">
                Applied
              </Badge>
            )}

            <div className="border-t border-border pt-4 space-y-3">
              {(drive.status === "upcoming" || drive.status === "ongoing") && (
                <>
                  <h2 className="text-base font-semibold">Drive Registration</h2>
                  {drive.registrationLink ? (
                    <Button
                      asChild
                      className="gradient-primary text-primary-foreground"
                    >
                      <a href={drive.registrationLink} target="_blank" rel="noreferrer">
                        Open registration form <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Registration link will be added soon.
                    </p>
                  )}
                </>
              )}

              <div>
                <h3 className="text-sm font-medium mb-1">Important Instructions</h3>
                <p className="text-sm text-muted-foreground">
                  {drive.applicationInstructions || "No special instructions shared for this drive yet."}
                </p>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DriveDetailsPage;
