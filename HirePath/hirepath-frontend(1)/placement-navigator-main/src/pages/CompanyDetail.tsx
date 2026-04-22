import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

interface Company {
  id: number;
  name: string;
  industry: string;
  minCgpa: number;
  branches: string;
  roles: string;
  packageLpa: string;
  companyProfileLink?: string;
  formLink?: string;
}

const CompanyDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:8080/api/companies/${id}`)
      .then((res) => setCompany(res.data));
  }, [id]);

  if (!company) return <AppLayout><p>Company not found</p></AppLayout>;

  const rolesArray = company.roles.split(",").map((r) => r.trim()).filter(Boolean);
  const branchesArray = company.branches.split(",").map((b) => b.trim()).filter(Boolean);

  return (
    <AppLayout>
      <div className="space-y-6">
        <Link to="/companies" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Companies
        </Link>

        <div className="flex items-start gap-6">
          <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center text-3xl font-bold text-primary-foreground shrink-0">
            {company.name[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <p className="text-muted-foreground mt-1">{company.industry}</p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                ₹{company.packageLpa} LPA
              </Badge>
              <Badge variant="outline">Min CGPA: {company.minCgpa}</Badge>
              {company.companyProfileLink && (
                <a
                  href={company.companyProfileLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Company profile <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {company.formLink && (
                <a
                  href={company.formLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Form link <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-lg">Eligibility Criteria</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Min CGPA</span>
                <span className="font-medium">{company.minCgpa}</span>
              </div>
              <div className="text-muted-foreground">Branches</div>
              <div className="flex flex-wrap gap-2">
                {branchesArray.map((branch) => (
                  <Badge key={branch} variant="secondary">{branch}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader><CardTitle className="text-lg">Roles Offered</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {rolesArray.map((role) => (
                <Badge key={role} variant="secondary">
                  {role}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CompanyDetail;
