import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  User,
  Mail,
  Hash,
  BookOpen,
  Calendar,
  Trophy
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRole } from "@/contexts/RoleContext";
import { AxiosError } from "axios";

const ProfilePage = () => {

  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [resumePath, setResumePath] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user, role } = useRole();
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    collegeId: "",
    branch: "",
    section: "",
    batch: "",
    cgpa: ""
  });

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:8080/api/users/${user.id}`)
      .then((res) => {
        setProfile(res.data);
        setResumePath(res.data.resumePath || "");
      });
  }, [user]);

  const handleChange = (field: string, value: any) => {
    setProfile({
      ...profile,
      [field]: value
    });
  };

  const handleSave = async () => {
  try {
    await axios.put(
      `http://localhost:8080/api/users/${user?.id}`,
      profile
    );

    setEditMode(false);

    toast({
      title: "Profile updated successfully!",
    });

  } catch {
    toast({
      title: "Failed to update profile",
      variant: "destructive",
    });
  }
};

  const handleResumeUpload = async (file: File) => {
    if (!user?.id) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Max file size is 5MB", variant: "destructive" });
      return;
    }
    const extension = file.name.toLowerCase();
    if (!(extension.endsWith(".pdf") || extension.endsWith(".doc") || extension.endsWith(".docx"))) {
      toast({ title: "Only PDF, DOC, DOCX allowed", variant: "destructive" });
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        `http://localhost:8080/api/users/${user.id}/resume`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResumePath(res.data);
      toast({ title: "Resume uploaded successfully" });
    } catch (error) {
      const err = error as AxiosError<string>;
      toast({ title: err.response?.data || "Resume upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleResumeDelete = async () => {
    if (!user?.id) return;
    try {
      setDeleting(true);
      await axios.delete(`http://localhost:8080/api/users/${user.id}/resume`);
      setResumePath("");
      toast({ title: "Resume deleted successfully" });
    } catch (error) {
      const err = error as AxiosError<string>;
      toast({ title: err.response?.data || "Failed to delete resume", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const info = [
    { label: "Name", key: "name", icon: User },
    { label: "Email", key: "email", icon: Mail },
    { label: "College ID", key: "collegeId", icon: Hash },
    { label: "Branch", key: "branch", icon: BookOpen },
    { label: "Section", key: "section", icon: BookOpen },
    { label: "Batch", key: "batch", icon: Calendar },
    { label: "CGPA", key: "cgpa", icon: Trophy },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 w-full px-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">
              View and manage your profile
            </p>
          </div>

          {!editMode ? (
            <Button onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          ) : (
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          )}
        </div>

        {/* PROFILE INFO */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">
              Personal Information
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {info.map((item) => {

                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="p-2 rounded-lg bg-secondary">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="w-full">
                      <p className="text-xs text-muted-foreground">
                        {item.label}
                      </p>

                      {editMode && item.key !== "email" ? (
                        <Input
                          value={(profile as any)[item.key] || ""}
                          onChange={(e) =>
                            handleChange(item.key, e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-sm font-medium">
                          {(profile as any)[item.key] || "Not set"}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>
          </CardContent>
        </Card>

        {role === "student" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
            </CardHeader>

            <CardContent>

              <div
                className={`mt-4 border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleResumeUpload(file);
                }}
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />

                <p className="text-sm text-muted-foreground">
                  Drag & drop your resume here
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC up to 5MB
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Browse Files"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleResumeUpload(file);
                    e.target.value = "";
                  }}
                />
                {resumePath && user?.id && (
                  <div className="mt-3 flex justify-center gap-3">
                    <a
                      href={`http://localhost:8080/api/users/${user.id}/resume`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary underline"
                    >
                      View uploaded resume
                    </a>
                    <button
                      type="button"
                      onClick={handleResumeDelete}
                      disabled={deleting}
                      className="text-sm text-destructive underline disabled:opacity-70"
                    >
                      {deleting ? "Deleting..." : "Delete resume"}
                    </button>
                  </div>
                )}

              </div>

            </CardContent>
          </Card>
        )}

      </div>
    </AppLayout>
  );
};

export default ProfilePage;
