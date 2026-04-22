import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useNavigate } from "react-router-dom";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

interface Drive {
  id: number;
  companyName: string;
  role: string;
  date: string;
  deadline: string;
  minCgpa: number;
  branches: string;
  status: string;
}

interface Application {
  id: number;
  drive: {
    id: number;
  };
}

const DriveCalendar = () => {
  const navigate = useNavigate();
  const today = new Date();

  const [currentMonthIndex, setCurrentMonthIndex] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [drives, setDrives] = useState<Drive[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const storedUser = localStorage.getItem("user");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const studentId = loggedInUser?.id;

  // Fetch drives
  useEffect(() => {
    axios.get("http://localhost:8080/api/drives")
      .then(res => setDrives(res.data));
  }, []);

  // Fetch applications
  useEffect(() => {
    if (!studentId) return;

    axios.get(`http://localhost:8080/api/applications/student/${studentId}`)
      .then(res => setApplications(res.data));
  }, [studentId]);

  // Check applied
  const hasApplied = (driveId: number) => {
    return applications.some(app => app.drive?.id === driveId);
  };

  // Color logic
  const getDriveColor = (drive: Drive) => {
    const driveDate = new Date(drive.date);

    if (hasApplied(drive.id)) {
      return "bg-green-500 text-white"; // Applied
    }

    if (driveDate > today) {
      return "bg-red-500 text-white"; // Upcoming
    }

    return "bg-yellow-400 text-black"; // Completed
  };

  const drivesByMonthDay = drives.reduce((acc, d) => {
    const dt = new Date(d.date);
    const key = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
    acc[key] = acc[key] || [];
    acc[key].push(d);
    return acc;
  }, {} as Record<string, Drive[]>);

  const monthsToShow = [
    currentMonthIndex,
    currentMonthIndex + 1,
    currentMonthIndex + 2,
  ];

  const handleNext = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Placement Drive Calendar</h1>
            <p className="text-lg font-medium text-muted-foreground">Track your drives visually</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={handlePrev}>
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <h2 className="text-2xl font-bold">
              {MONTH_NAMES[currentMonthIndex]} {currentYear}
            </h2>

            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 text-lg font-medium">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            Applied
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            Upcoming
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            Completed
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {monthsToShow.map((monthIdxRaw, index) => {

            let monthIdx = monthIdxRaw;
            let year = currentYear;

            if (monthIdx < 0) {
              monthIdx = 11;
              year = currentYear - 1;
            }

            if (monthIdx > 11) {
              monthIdx = 0;
              year = currentYear + 1;
            }

            const daysInMonth = getDaysInMonth(year, monthIdx);
            const firstDay = getFirstDayOfMonth(year, monthIdx);
            const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

            return (
              <Card key={index} className="glass-card overflow-hidden">
                <CardHeader className="py-3 px-4 gradient-primary">
                  <CardTitle className="text-lg font-bold text-primary-foreground">
                    {MONTH_NAMES[monthIdx]} {year}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-3">

                  <div className="mb-2 grid grid-cols-7 gap-1 text-center text-sm font-bold">
                    {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => (
                      <div key={day}>{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">

                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={i} />
                    ))}

                    {days.map(day => {
                      const dayDrives = drivesByMonthDay[`${year}-${monthIdx}-${day}`];

                      return (
                        <div key={day} className="min-h-[88px] rounded-md border p-2 text-sm">

                          <div className="mb-1 font-bold">{day}</div>

                          {dayDrives?.map(d => (
                            <div
                              key={d.id}
                              onClick={() => navigate(`/drives/${d.id}`)}
                              className={`mb-1 cursor-pointer truncate rounded px-1.5 py-1 text-xs font-bold ${getDriveColor(d)}`}
                            >
                              {d.companyName}
                            </div>
                          ))}

                        </div>
                      );
                    })}

                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </AppLayout>
  );
};

export default DriveCalendar;
