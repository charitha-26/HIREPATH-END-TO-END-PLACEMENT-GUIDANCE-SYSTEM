import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#376863", "#6f3a41"];

const PlacementsPage = () => {
  const [batch, setBatch] = useState<string>("");
  const [stats, setStats] = useState<any>(null);
  const [companies, setCompanies] = useState<any>({});
  const [batches, setBatches] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [companyStudents, setCompanyStudents] = useState<any[]>([]);


  const handleCompanyClick = (company: string) => {
  setSelectedCompany(company);

  fetch(
    `http://localhost:8080/api/placements/${batch}/company/${encodeURIComponent(company)}`
  )
    .then((res) => res.json())
    .then((data) => setCompanyStudents(data))
    .catch((err) => console.error("Error fetching company students:", err));
};

  // ✅ Fetch batches from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/placements/batches")
      .then((res) => res.json())
      .then((data) => {
        setBatches(data);

        // set latest batch automatically
        if (data.length > 0) {
          setBatch(data[0]);
        }
      });
  }, []);

  // ✅ Fetch stats when batch changes
  useEffect(() => {
    if (!batch) return;

    const fetchData = async () => {
      try {
        const res1 = await fetch(
          `http://localhost:8080/api/placements/${batch}`
        );
        const data1 = await res1.json();

        const res2 = await fetch(
          `http://localhost:8080/api/placements/${batch}/companies`
        );
        const data2 = await res2.json();

        setStats(data1);
        setCompanies(data2);
      } catch (error) {
        console.error("Error fetching placement data", error);
      }
    };

    fetchData();
  }, [batch]);

  // ✅ Pie Data
  const pieData = stats
    ? [
        { name: "Placed", value: stats.placed },
        { name: "Unplaced", value: stats.unplaced },
      ]
    : [];

  // ✅ Top 8 companies
  const barData = Object.entries(companies)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 8)
    .map(([company, count]) => ({
      company,
      count,
    }));

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold">Placements Dashboard-CSE(AI&ML)</h1>
          <p className="text-muted-foreground">
            Track placement statistics and hiring trends
          </p>
        </div>

        {/* 🔥 Dynamic Batch Buttons */}
        <div className="flex gap-3 flex-wrap">
          {batches.map((b) => (
            <button
              key={b}
              onClick={() => setBatch(b)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                batch === b
                  ? "gradient-primary text-white"
                  : "bg-secondary"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <Card><CardContent className="p-5">
              <p>Total Eligible Students</p>
              <h2 className="text-xl font-bold">{stats.totalStudents}</h2>
            </CardContent></Card>

            <Card><CardContent className="p-5">
              <p>Placed</p>
              <h2 className="text-xl font-bold text-green-600">{stats.placed}</h2>
            </CardContent></Card>

            <Card><CardContent className="p-5">
              <p>Unplaced</p>
              <h2 className="text-xl font-bold text-red-600">{stats.unplaced}</h2>
            </CardContent></Card>

            <Card><CardContent className="p-5">
              <p>Placement Rate</p>
              <h2 className="text-xl font-bold">
                {stats.placementRate.toFixed(2)}%
              </h2>
            </CardContent></Card>

            <Card><CardContent className="p-5">
              <p>Highest Package</p>
              <h2 className="text-xl font-bold">{stats.highestPackage} LPA ({stats.highestCompany})</h2>
            </CardContent></Card>

            <Card><CardContent className="p-5">
              <p>Top Company</p>
              <h2 className="text-xl font-bold">{stats.topCompany}</h2>
            </CardContent></Card>

          </div>
        )}

        {/* Charts */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Pie Chart */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Placement Distribution
                </h2>

                <div className="w-full h-[300px]">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        outerRadius={100}
                        label
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Top Hiring Companies
                </h2>

                <div className="w-full h-[300px]">
                  <ResponsiveContainer>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="company"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="#4d9084"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>
        )}

        {/* Company List */}
        {companies && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Company Hiring</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(companies)
                .sort((a: any, b: any) =>
                  a[0].localeCompare(b[0])
                )
                .map(([company, count]) => (
                  <Card key={company}
                    onClick={() => handleCompanyClick(company)}
                    className="cursor-pointer hover:shadow-lg transition">
                    <CardContent className="p-4">
                      <p className="font-semibold">{company}</p>
                      <p className="text-sm text-muted-foreground">
                        {count as number} students
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Company Students Modal */}
        {selectedCompany && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

    <div className="bg-white rounded-xl w-[90%] max-w-2xl shadow-xl p-6 relative">

      {/* Close Button */}
      <button
        onClick={() => {
          setSelectedCompany(null);
          setCompanyStudents([]);
        }}
        className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-red-500"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-xl font-bold mb-4">
        {selectedCompany} Students
      </h2>

      {/* Content */}
      {companyStudents.length === 0 ? (
        <p className="text-sm text-gray-500">No students found</p>
      ) : (
        <div className="max-h-[400px] overflow-y-auto space-y-3">

          {companyStudents.map((s, i) => (
            <div
              key={i}
              className="flex justify-between items-center border p-3 rounded-lg"
            >
              <div>
                <p className="font-medium">{s.studentName}</p>
                <p className="text-sm text-muted-foreground">
                  {s.rollNumber}
                </p>
              </div>

              <div className="text-blue-600 font-semibold">
                {s.packageAmount} LPA
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  </div>
)}
      </div>
    </AppLayout>
  );
};

export default PlacementsPage;