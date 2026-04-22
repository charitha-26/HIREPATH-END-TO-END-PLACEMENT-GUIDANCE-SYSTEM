import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

export interface JobApplication {
  id: number;
  companyName: string;
  role: string;
  status: string;
  appliedDate: string;
  drive?: {
    id: number;
  };
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

export const getStudentApplications = async (studentId: number) => {
  const response = await axios.get<JobApplication[]>(
    `${API_BASE_URL}/applications/student/${studentId}`
  );
  return response.data;
};

export const applyToDrive = async (studentId: number, driveId: number | string) => {
  const response = await axios.post<JobApplication>(
    `${API_BASE_URL}/applications/apply`,
    null,
    { params: { studentId, driveId } }
  );
  return response.data;
};

export const getAdminApplications = async () => {
  const response = await axios.get<JobApplication[]>(`${API_BASE_URL}/admin/applications`);
  return response.data;
};

export const updateAdminApplicationStatus = async (id: number, status: string) => {
  const response = await axios.put<JobApplication>(
    `${API_BASE_URL}/admin/applications/${id}/status`,
    null,
    { params: { status } }
  );
  return response.data;
};
