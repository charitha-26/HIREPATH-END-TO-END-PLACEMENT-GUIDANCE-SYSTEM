import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const InternshipsPage = () => {
  const [batch, setBatch] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [batches, setBatches] = useState<string[]>([]);

  const [internshipOpen, setInternshipOpen] = useState(false);
  const [fteOpen, setFteOpen] = useState(false);

  const [internshipFilter, setInternshipFilter] = useState("All");
  const [fteFilter, setFteFilter] = useState("All");

  // Fetch batches
  useEffect(() => {
    fetch("http://localhost:8080/api/internships/batches")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBatches(data);
          if (data.length > 0) setBatch(data[0]);
        }
      });
  }, []);

  // Fetch students
  useEffect(() => {
    if (!batch) return;

    fetch(`http://localhost:8080/api/internships/${batch}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStudents(data);
        else setStudents([]);
      });
  }, [batch]);

  const filteredStudents = students.filter((s) => {
    const internshipMatch =
      internshipFilter === "All" ||
      s.internshipStatus === internshipFilter;

    const fteMatch =
      fteFilter === "All" ||
      s.fteStatus === fteFilter;

    return internshipMatch && fteMatch;
  });

  const companyMap: Record<string, number> = {};

  students.forEach((s) => {
    if (s.internshipCompany && s.internshipCompany !== "NIL") {
      s.internshipCompany.split(",").forEach((c: string) => {
        const name = c.trim();
        if (name) {
          companyMap[name] = (companyMap[name] || 0) + 1;
        }
      });
    }
  });

  const barData = Object.entries(companyMap)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 8)
    .map(([company, count]) => ({ company, count }));

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold">Internships-CSE(AI&ML)</h1>
          <p className="text-muted-foreground">
            View internship participation and FTE outcomes
          </p>
        </div>

        {/* Batch Buttons */}
        <div className="flex gap-3 flex-wrap">
          {batches.map((b) => (
            <button
              key={b}
              onClick={() => setBatch(b)}
              className={`px-4 py-2 rounded-lg text-sm ${
                batch === b
                  ? "gradient-primary text-white"
                  : "bg-secondary"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Bar Graph */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Top Internship Companies (Full Batch)
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
                  <Bar dataKey="count" fill="#437e73" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Students + Filters */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">

          <h2 className="text-xl font-semibold">
            Students ({filteredStudents.length})
          </h2>

          {/* Filters */}
          <div className="flex items-center gap-6 mr-6">

            {/* Internship */}
            <div className="relative min-w-[170px]">
              <button
                onClick={() => {
                  setInternshipOpen(!internshipOpen);
                  setFteOpen(false);
                }}
                className="w-full px-4 py-2 rounded-lg text-sm font-semibold tracking-wide border
                           bg-blue-50 text-blue-800 border-blue-300"
              >
                {internshipFilter === "All"
                  ? "All Internship"
                  : internshipFilter}
              </button>

              {internshipOpen && (
                <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-lg border z-50 p-1">
                  {["All", "Ongoing", "Completed", "Yet to Start"].map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        setInternshipFilter(item);
                        setInternshipOpen(false);
                      }}
                      className={`px-3 py-2 text-sm font-semibold tracking-wide rounded-lg cursor-pointer whitespace-nowrap
                      ${
                        internshipFilter === item
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-100 text-gray-800"
                      }`}
                    >
                      {item === "All" ? "All Internship" : item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FTE */}
            <div className="relative min-w-[170px]">
              <button
                onClick={() => {
                  setFteOpen(!fteOpen);
                  setInternshipOpen(false);
                }}
                className="w-full px-4 py-2 rounded-lg text-sm font-semibold tracking-wide border
                           bg-green-50 text-green-800 border-green-300"
              >
                {fteFilter === "All" ? "All FTE" : fteFilter}
              </button>

              {fteOpen && (
                <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-lg border z-50 p-1">
                  {["All", "Placed", "Not Placed"].map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        setFteFilter(item);
                        setFteOpen(false);
                      }}
                      className={`px-3 py-2 text-sm font-semibold tracking-wide rounded-lg cursor-pointer whitespace-nowrap
                      ${
                        fteFilter === item
                          ? "bg-green-600 text-white"
                          : "hover:bg-green-100 text-gray-800"
                      }`}
                    >
                      {item === "All" ? "All FTE" : item}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Students */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((s, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-2">

                <p className="font-semibold">{s.studentName}</p>
                <p className="text-sm text-muted-foreground">{s.rollNumber}</p>

                <p>
                  <strong>Internships:</strong> {s.internshipCompany || "NIL"}
                </p>

                <p>
                  <strong>Stipend:</strong>{" "}
                  {s.stipend ? `₹${s.stipend.toLocaleString()}` : "N/A"}
                </p>

                <p className="text-sm text-muted-foreground">
                  {s.startDate
                    ? new Date(s.startDate).toLocaleDateString()
                    : "N/A"}{" "}
                  →{" "}
                  {s.endDate
                    ? new Date(s.endDate).toLocaleDateString()
                    : "N/A"}
                </p>

                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    s.internshipStatus === "Completed"
                      ? "bg-yellow-100 text-yellow-700"
                      : s.internshipStatus === "Ongoing"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Internship: {s.internshipStatus}
                </span>

                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      s.fteStatus === "Placed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    FTE: {s.fteStatus}
                  </span>

                  {s.fteStatus === "Placed" && (
                    <span className="text-sm">
                      {s.fteCompany} ({s.ftePackage} LPA)
                    </span>
                  )}
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </AppLayout>
  );
};

export default InternshipsPage;