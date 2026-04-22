import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";

interface Company {
  id: number;
  name: string;
  industry: string;
  minCgpa: number;
  branches: string;
  roles: string;
  packageLpa: string;
}

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");

  // 🔹 Fetch from backend
  useEffect(() => {
    axios.get("http://localhost:8080/api/companies")
      .then(res => setCompanies(res.data));
  }, []);

  // 🔹 Filtering logic
  const filtered = companies.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());

    const branchesArray = c.branches.split(",").map(b => b.trim());
    const matchBranch =
      branchFilter === "all" || branchesArray.includes(branchFilter);

    return matchSearch && matchBranch;
  });

  return (
    <AppLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-bold">Company Profiles</h1>
          <p className="text-muted-foreground">
            Explore companies visiting campus
          </p>
        </div>

        {/* 🔹 Search + Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="ECE">ECE</SelectItem>
              <SelectItem value="EEE">EEE</SelectItem>
              <SelectItem value="AI&ML">AI&ML</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 🔹 Company Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {filtered.map((c) => {

            const rolesArray = c.roles.split(",").map(r => r.trim());

            return (
              <Link key={c.id} to={`/companies/${c.id}`}>

                <Card className="glass-card hover:border-primary/30 transition-all hover:scale-[1.02] cursor-pointer">
                  <CardContent className="p-5">

                    <div className="flex items-start gap-4">

                      {/* Logo Placeholder (First Letter) */}
                      <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground shrink-0">
                        {c.name[0]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">
                          {c.name}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {c.industry}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Min CGPA: {c.minCgpa}
                          </Badge>

                          <Badge
                            variant="outline"
                            className="text-xs bg-success/10 text-success border-success/30"
                          >
                            ₹{c.packageLpa} LPA
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {rolesArray.map((r) => (
                            <Badge key={r} variant="secondary" className="text-xs">
                              {r}
                            </Badge>
                          ))}
                        </div>

                      </div>
                    </div>

                  </CardContent>
                </Card>

              </Link>
            );
          })}

        </div>

      </div>
    </AppLayout>
  );
};

export default CompaniesPage;