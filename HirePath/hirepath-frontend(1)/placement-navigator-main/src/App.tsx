import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import DriveCalendar from "./pages/DriveCalendar";
import CompaniesPage from "./pages/CompaniesPage";
import CompanyDetail from "./pages/CompanyDetail";
import ExperiencesPage from "./pages/ExperiencesPage";
import AlumniPage from "./pages/AlumniPage";
import ProfilePage from "./pages/ProfilePage";
import TrainingsPage from "./pages/TrainingsPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCompanies from "./pages/admin/ManageCompanies";
import ManageDrives from "./pages/admin/ManageDrives";
import StudentTracking from "./pages/admin/StudentTracking";
import ApproveExperiences from "./pages/admin/ApproveExperiences";
import AdminTrainingsPage from "./pages/admin/AdminTrainingsPage";
import ManageAlumni from "./pages/admin/ManageAlumni";

import NotFound from "./pages/NotFound";
import DriveDetailsPage from "./pages/DriveDetailsPage";

import PlacementsPage from "./pages/PlacementsPage";
import InternshipsPage from "./pages/InternshipsPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RoleProvider>
          <ThemeProvider>
            <Toaster />
            <Sonner />

            <BrowserRouter>
              <Routes>

              {/* PUBLIC ROUTES */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* STUDENT ROUTES */}
              <Route path="/" element={<StudentDashboard />} />
              <Route path="/placements" element={<PlacementsPage />} />
              <Route path="/calendar" element={<DriveCalendar />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/companies/:id" element={<CompanyDetail />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/alumni" element={<AlumniPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/drives/:id" element={<DriveDetailsPage />} />
              <Route path="/internships" element={<InternshipsPage />} />
              {/* NEW TRAININGS PAGE */}
              <Route path="/trainings" element={<TrainingsPage />} />
              
              {/* ADMIN ROUTES */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />

              

{/* ADMIN ROUTES */}
<Route
  path="/admin/placements"
  element={
    <ProtectedAdminRoute>
      <PlacementsPage />
    </ProtectedAdminRoute>
  }
/>
<Route
  path="/admin/placements"
  element={
    <ProtectedAdminRoute>
      <InternshipsPage/>
    </ProtectedAdminRoute>
  }
/>

              <Route
                path="/admin/companies"
                element={
                  <ProtectedAdminRoute>
                    <ManageCompanies />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/admin/drives"
                element={
                  <ProtectedAdminRoute>
                    <ManageDrives />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/admin/students"
                element={
                  <ProtectedAdminRoute>
                    <StudentTracking />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/alumni"
                element={
                  <ProtectedAdminRoute>
                    <ManageAlumni />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/admin/experiences"
                element={
                  <ProtectedAdminRoute>
                    <ApproveExperiences />
                  </ProtectedAdminRoute>
                }
              />

              {/* NEW ADMIN TRAININGS PAGE */}
              <Route
                path="/admin/trainings"
                element={
                  <ProtectedAdminRoute>
                    <AdminTrainingsPage />
                  </ProtectedAdminRoute>
                }
              />

              {/* FALLBACK */}
              <Route path="*" element={<NotFound />} />

              </Routes>
            </BrowserRouter>
          </ThemeProvider>

        </RoleProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;