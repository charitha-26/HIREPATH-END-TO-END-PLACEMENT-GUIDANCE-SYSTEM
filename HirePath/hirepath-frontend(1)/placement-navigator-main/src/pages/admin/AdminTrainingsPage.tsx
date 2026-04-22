import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  assignTrainingBatch,
  BatchTrainingAssignment,
  deleteTrainingBatch,
  getAppliedTrainingStudents,
  getAssignedTrainingBatches,
  getTrainingLeaderboard,
  getTrainings,
  StudentTraining,
  Training,
  updateTrainingBatch,
} from "@/services/trainingService";

const branches = ["CSE", "ECE", "AI&ML", "EEE", "IT"];
const sections = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const batches = ["2021", "2022", "2023", "2024"];

const emptyAssignmentForm = {
  branch: "",
  section: "",
  batch: "",
  trainingId: "",
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (typeof message?.message === "string" && message.message.trim()) {
      return message.message;
    }
  }

  return fallback;
};

const AdminTrainingsPage = () => {
  const [assignmentForm, setAssignmentForm] = useState(emptyAssignmentForm);
  const [showModal, setShowModal] = useState(false);
  const [assignedBatches, setAssignedBatches] = useState<BatchTrainingAssignment[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [editingAssignmentId, setEditingAssignmentId] = useState<number | null>(null);
  const [editingTrainingId, setEditingTrainingId] = useState("");
  const [selectedTraining, setSelectedTraining] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [search, setSearch] = useState("");
  const [topN, setTopN] = useState(10);
  const [leaderboard, setLeaderboard] = useState<StudentTraining[]>([]);
  const [appliedStudents, setAppliedStudents] = useState<StudentTraining[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const loadAssignments = async () => {
    const data = await getAssignedTrainingBatches();
    setAssignedBatches(data);
  };

  const loadTrainings = async () => {
    const data = await getTrainings();
    setTrainings(data);
  };

  useEffect(() => {
    loadAssignments().catch(console.error);
    loadTrainings().catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedTraining) {
      setLeaderboard([]);
      setAppliedStudents([]);
      return;
    }

    getTrainingLeaderboard({
      trainingId: Number(selectedTraining),
      branch: filterBranch || null,
      section: null,
      phase: null,
      search: search || null,
    })
      .then((result) => {
        const sorted = [...result].sort((a, b) => b.score - a.score);
        setLeaderboard(topN === -1 ? sorted : sorted.slice(0, topN));
      })
      .catch(() => setLeaderboard([]));

    getAppliedTrainingStudents(Number(selectedTraining))
      .then(setAppliedStudents)
      .catch(() => setAppliedStudents([]));
  }, [selectedTraining, filterBranch, search, topN]);

  const selectedTrainingName = useMemo(
    () => trainings.find((training) => training.id === Number(selectedTraining))?.platform ?? "",
    [selectedTraining, trainings]
  );

  const handleAssign = async () => {
    if (
      !assignmentForm.branch ||
      !assignmentForm.section ||
      !assignmentForm.batch ||
      !assignmentForm.trainingId
    ) {
      alert("Select all fields");
      return;
    }

    setIsSaving(true);

    try {
      await assignTrainingBatch({
        branch: assignmentForm.branch,
        section: assignmentForm.section,
        batch: assignmentForm.batch,
        trainingId: Number(assignmentForm.trainingId),
      });

      setAssignmentForm(emptyAssignmentForm);
      await loadAssignments();
    } catch (error) {
      console.error("Failed to assign training", error);
      alert(getErrorMessage(error, "Unable to assign training."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTrainingBatch(id);
      setAssignedBatches((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete assignment", error);
      alert(getErrorMessage(error, "Unable to delete assignment."));
    }
  };

  const handleUpdate = async (assignment: BatchTrainingAssignment) => {
    if (!editingTrainingId) {
      return;
    }

    try {
      await updateTrainingBatch(assignment.id, {
        branch: assignment.branch,
        section: assignment.section,
        batch: assignment.batch,
        trainingId: Number(editingTrainingId),
      });

      const updatedTraining = trainings.find((training) => training.id === Number(editingTrainingId));
      setAssignedBatches((current) =>
        current.map((item) =>
          item.id === assignment.id && updatedTraining
            ? { ...item, training: updatedTraining }
            : item
        )
      );
      setEditingAssignmentId(null);
      setEditingTrainingId("");
    } catch (error) {
      console.error("Failed to update assignment", error);
      alert(getErrorMessage(error, "Unable to update assignment."));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Training Dashboard</h1>

        <Card className="p-6">
          <CardHeader className="mb-4 flex flex-row items-center justify-between">
            <h2 className="text-xl font-semibold">Assign Training</h2>
            <Button onClick={() => setShowModal(true)}>View Assigned</Button>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <select
              value={assignmentForm.branch}
              onChange={(e) => setAssignmentForm((current) => ({ ...current, branch: e.target.value }))}
              className="rounded-lg border-2 border-teal-500 bg-muted px-3 py-2 font-semibold text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-600 transition"
            >
              <option value="">Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>

            <select
              value={assignmentForm.section}
              onChange={(e) => setAssignmentForm((current) => ({ ...current, section: e.target.value }))}
              className="rounded-lg border-2 border-teal-500 bg-muted px-3 py-2 font-semibold text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-600 transition"
            >
              <option value="">Section</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>

            <select
              value={assignmentForm.batch}
              onChange={(e) => setAssignmentForm((current) => ({ ...current, batch: e.target.value }))}
              className="rounded-lg border-2 border-teal-500 bg-muted px-3 py-2 font-semibold text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-600 transition"
            >
              <option value="">Batch</option>
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>

            <select
              value={assignmentForm.trainingId}
              onChange={(e) => setAssignmentForm((current) => ({ ...current, trainingId: e.target.value }))}
              className="rounded-lg border-2 border-teal-500 bg-muted px-3 py-2 font-semibold text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-600 transition"
            >
              <option value="">Training</option>
              {trainings.map((training) => (
                <option key={training.id} value={training.id}>
                  {training.platform}
                </option>
              ))}
            </select>

            <Button className="md:col-span-2" onClick={handleAssign} disabled={isSaving}>
              {isSaving ? "Assigning..." : "Assign Training"}
            </Button>
          </CardContent>
        </Card>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-[90%] max-w-4xl rounded-xl bg-background border border-border p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Assigned Trainings</h2>
                <Button onClick={() => setShowModal(false)}>Close</Button>
              </div>

              <table className="w-full border border-border bg-background rounded-lg overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 font-bold text-foreground">Branch</th>
                    <th className="p-3 font-bold text-foreground">Section</th>
                    <th className="p-3 font-bold text-foreground">Batch</th>
                    <th className="p-3 font-bold text-foreground">Training</th>
                    <th className="p-3 font-bold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedBatches.map((item) => (
                    <tr key={item.id} className="border-t border-border text-center hover:bg-muted/50 transition">
                      <td className="p-3 text-foreground font-medium">{item.branch}</td>
                      <td className="p-3 text-foreground font-medium">{item.section}</td>
                      <td className="p-3 text-foreground font-medium">{item.batch}</td>
                      <td className="p-3 text-foreground font-medium">
                        {editingAssignmentId === item.id ? (
                          <select
                            value={editingTrainingId}
                            onChange={(e) => setEditingTrainingId(e.target.value)}
                            className="rounded border p-2"
                          >
                            {trainings.map((training) => (
                              <option key={training.id} value={training.id}>
                                {training.platform}
                              </option>
                            ))}
                          </select>
                        ) : (
                          item.training.platform
                        )}
                      </td>
                      <td className="flex justify-center gap-2 p-2">
                        {editingAssignmentId === item.id ? (
                          <Button onClick={() => handleUpdate(item)}>Save</Button>
                        ) : (
                          <Button
                            onClick={() => {
                              setEditingAssignmentId(item.id);
                              setEditingTrainingId(String(item.training.id));
                            }}
                          >
                            Edit
                          </Button>
                        )}
                        <Button variant="destructive" onClick={() => handleDelete(item.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Card className="p-4">
          <h2 className="mb-2 text-lg font-semibold">Select Training</h2>
          <select
            value={selectedTraining}
            onChange={(e) => setSelectedTraining(e.target.value)}
            className="rounded-lg border-2 border-teal-500 bg-muted px-3 py-2 font-semibold text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-600 transition"
          >
            <option value="">Select training</option>
            {trainings.map((training) => (
              <option key={training.id} value={training.id}>
                {training.platform}
              </option>
            ))}
          </select>
        </Card>

        {selectedTraining && (
          <>
            <Card className="p-6">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <h2 className="text-xl font-semibold">Leaderboard</h2>

                <div className="flex flex-col gap-3 md:flex-row">
                  <select
                    value={filterBranch}
                    onChange={(e) => setFilterBranch(e.target.value)}
                    className="w-full border border-border bg-background rounded-lg overflow-hidden"
                  >
                    <option value="">All Branches</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>

                  <Input
                    placeholder="Search by college ID"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-border bg-background rounded-lg overflow-hidden"
                  />

                  <select
                    value={topN === -1 ? "ALL" : String(topN)}
                    onChange={(e) => setTopN(e.target.value === "ALL" ? -1 : Number(e.target.value))}
                    className="w-full border border-border bg-background rounded-lg overflow-hidden"
                  >
                    {[10, 20, 30, 40, 50].map((count) => (
                      <option key={count} value={count}>
                        Top {count}
                      </option>
                    ))}
                    <option value="ALL">All</option>
                  </select>
                </div>
              </div>

              <table className="w-full border border-border bg-background rounded-lg overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 font-bold text-foreground">Rank</th>
                    <th className="p-3 font-bold text-foreground">Name</th>
                    <th className="p-3 font-bold text-foreground">College ID</th>
                    <th className="p-3 font-bold text-foreground">Branch</th>
                    <th className="p-3 font-bold text-foreground">Score</th>
                    <th className="p-3 font-bold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((item, index) => (
                    <tr key={item.id} className="border-t border-border text-center hover:bg-muted/50 transition">
                      <td className="p-3 text-foreground font-medium">{index + 1}</td>
                      <td className="p-3 text-foreground font-medium">{item.student.name}</td>
                      <td className="p-3 text-foreground font-medium">{item.student.collegeId || "-"}</td>
                      <td className="p-3 text-foreground font-medium">{item.student.branch || "-"}</td>
                      <td className="p-3 font-bold text-indigo-600">{item.score}</td>
                      <td className="p-3 text-foreground font-medium">{item.applicationStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Applied Students</h2>
                <p className="text-sm text-muted-foreground">
                  Students who applied for {selectedTrainingName || "this training"}.
                </p>
              </div>

              <table className="w-full overflow-hidden rounded border">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 font-bold text-foreground">Student</th>
                    <th className="p-3 font-bold text-foreground">College ID</th>
                    <th className="p-3 font-bold text-foreground">Branch</th>
                    <th className="p-3 font-bold text-foreground">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {appliedStudents.map((item) => (
                    <tr key={item.id} className="border-t text-center">
                      <td className="p-3 text-foreground font-medium">{item.student.name}</td>
                      <td className="p-3 text-foreground font-medium">{item.student.collegeId || "-"}</td>
                      <td className="p-3 text-foreground font-medium">{item.student.branch || "-"}</td>
                      <td className="p-3 text-foreground font-medium">{item.student.email || "-"}</td>
                    </tr>
                  ))}
                  {appliedStudents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-sm text-muted-foreground">
                        No students have applied for this training yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminTrainingsPage;
