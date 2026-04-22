import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, GraduationCap } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import axios from "axios";

interface Alumni {
  id: number;
  name: string;
  graduationYear: string;
  companyName: string;
  linkedinUrl?: string;
}

const getLinkedInHref = (linkedinUrl?: string) => {
  if (!linkedinUrl) {
    return "";
  }

  return /^https?:\/\//i.test(linkedinUrl) ? linkedinUrl : `https://${linkedinUrl}`;
};

const AlumniPage = () => {
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [alumni, setAlumni] = useState<Alumni[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/alumni").then((res) => setAlumni(res.data));
  }, []);

  const filtered = alumni.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchCompany = companyFilter === "all" || a.companyName === companyFilter;
    return matchSearch && matchCompany;
  });

  const grouped = filtered.reduce((acc, a) => {
    const companyName = a.companyName || "Unknown Company";
    acc[companyName] = acc[companyName] || [];
    acc[companyName].push(a);
    return acc;
  }, {} as Record<string, Alumni[]>);

  const companies = Array.from(new Set(alumni.map((a) => a.companyName))).filter(Boolean);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Alumni Directory</h1>
          <p className="text-muted-foreground">Connect with alumni across companies</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search alumni..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map((companyName) => (
                <SelectItem key={companyName} value={companyName}>
                  {companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {Object.entries(grouped).map(([company, members]) => (
            <div key={company}>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-primary-foreground">
                  {company[0]}
                </div>
                {company}
                <span className="text-sm font-normal text-muted-foreground">({members.length})</span>
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {members.map((a) => (
                  <Card key={a.id} className="glass-card transition-colors hover:border-primary/30">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        <GraduationCap className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{a.name}</p>
                        <p className="text-xs text-muted-foreground">Class of {a.graduationYear}</p>
                        {a.linkedinUrl && (
                          <a
                            href={getLinkedInHref(a.linkedinUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-medium text-primary underline underline-offset-2"
                          >
                            View LinkedIn Profile
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default AlumniPage;
