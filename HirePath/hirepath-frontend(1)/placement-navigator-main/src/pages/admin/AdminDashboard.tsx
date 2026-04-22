import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, BarChart3 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const COLORS = [ "#1d3550","#6f3a41","#376863",  "#92612188"];

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [branchData, setBranchData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/admin/stats")
      .then(res => setStats(res.data));

    axios.get("http://localhost:8080/api/admin/branch-stats")
      .then(res => setBranchData(res.data));

    axios.get("http://localhost:8080/api/admin/status-stats")
      .then(res => {
        const formatted = Object.entries(res.data).map(([key, value]) => ({
          name: key,
          value
        }));
        setStatusData(formatted);
      });
  }, []);

  if (!stats) return null;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold">Admin Dashboard-CSE(AI&ML)</h1>
          <p className="mt-2 text-xl font-medium text-muted-foreground">
            Track student outcomes, application progress, and placement performance.
          </p>
        </div>

        {/* KPI SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-muted-foreground">Total Eligible Students</p>
                <h2 className="text-4xl font-extrabold">{stats.totalStudents}</h2>
              </div>
              <Users className="h-11 w-11 text-blue-500" />
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-muted-foreground">Applications</p>
                <h2 className="text-4xl font-extrabold">{stats.totalApplications}</h2>
              </div>
              <BarChart3 className="h-11 w-11 text-yellow-500" />
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-muted-foreground">Students Placed</p>
                <h2 className="text-4xl font-extrabold">{stats.studentsPlaced}</h2>
              </div>
              <Trophy className="h-11 w-11 text-green-500" />
            </CardContent>
          </Card>

          {/* Donut Chart Placement Rate */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <p className="mb-4 text-lg font-medium text-muted-foreground">Placement Rate</p>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Placed", value: stats.placementRate },
                      { name: "Remaining", value: 100 - stats.placementRate }
                    ]}
                    dataKey="value"
                    innerRadius={40}
                    outerRadius={55}
                  >
                    <Cell fill="#376863" />
                    <Cell fill="#e0d9da" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 text-center text-2xl font-extrabold">
                {stats.placementRate}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CHART SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Branch Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Branch Performance-2023</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={branchData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="branch" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="placed" fill="#376863" />
                  <Bar dataKey="total" fill="#6f3a41" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Application Status-2023</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {statusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
