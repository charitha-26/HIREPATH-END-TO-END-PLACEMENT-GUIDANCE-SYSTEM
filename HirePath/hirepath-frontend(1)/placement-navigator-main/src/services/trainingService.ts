import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

export interface Training {
  id: number;
  platform: string;
  description?: string;
}

export interface StudentSummary {
  id: number;
  name: string;
  collegeId?: string;
  branch?: string;
  section?: string;
  batch?: string;
  email?: string;
}

export interface StudentTraining {
  id: number;
  phase: number;
  score: number;
  studentRank: number;
  applicationStatus: string;
  appliedAt?: string;
  training: Training;
  student: StudentSummary;
}

export interface BatchTrainingAssignment {
  id: number;
  branch: string;
  section: string;
  batch: string;
  training: Training;
}

export interface BatchAssignPayload {
  branch: string;
  section: string;
  batch: string;
  trainingId: number;
}

export interface TrainingLeaderboardFilters {
  trainingId: number;
  branch?: string | null;
  section?: string | null;
  phase?: number | null;
  search?: string | null;
}

export const getTrainings = async () => {
  const response = await axios.get<Training[]>(`${API_BASE_URL}/trainings`);
  return response.data;
};

export const getStudentTrainings = async (studentId: number) => {
  const response = await axios.get<StudentTraining[]>(
    `${API_BASE_URL}/student-training/student/${studentId}`
  );
  return response.data;
};

export const applyToTraining = async (studentTrainingId: number, studentId: number) => {
  const response = await axios.post<StudentTraining>(
    `${API_BASE_URL}/student-training/${studentTrainingId}/apply`,
    null,
    { params: { studentId } }
  );
  return response.data;
};

export const getAppliedTrainingStudents = async (trainingId?: number) => {
  const response = await axios.get<StudentTraining[]>(
    `${API_BASE_URL}/student-training/applied`,
    { params: trainingId ? { trainingId } : undefined }
  );
  return response.data;
};

export const getAssignedTrainingBatches = async () => {
  const response = await axios.get<BatchTrainingAssignment[]>(
    `${API_BASE_URL}/batch-training/all`
  );
  return response.data;
};

export const assignTrainingBatch = async (payload: BatchAssignPayload) => {
  const response = await axios.post<string>(`${API_BASE_URL}/batch-training/assign`, payload);
  return response.data;
};

export const updateTrainingBatch = async (id: number, payload: BatchAssignPayload) => {
  const response = await axios.put<string>(`${API_BASE_URL}/batch-training/update/${id}`, payload);
  return response.data;
};

export const deleteTrainingBatch = async (id: number) => {
  const response = await axios.delete<string>(`${API_BASE_URL}/batch-training/${id}`);
  return response.data;
};

export const getTrainingLeaderboard = async (filters: TrainingLeaderboardFilters) => {
  const response = await axios.post<StudentTraining[]>(
    `${API_BASE_URL}/student-training/filter`,
    filters
  );
  return response.data;
};
