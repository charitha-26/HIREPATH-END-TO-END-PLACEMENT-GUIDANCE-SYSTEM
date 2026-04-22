import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        email,
        password,
      });

      toast({ title: "Account created successfully!" });

      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Registration failed or Email already exists",
        variant: "destructive",
      });
    }
  };

  const FloatingBvrith = () => {
  const items = Array.from({ length: 12 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((_, i) => {
        const left = (i * 8) % 100; // prevents overlap spacing
        const delay = i * 1; // staggered timing

        return (
          <span
            key={i}
            className="absolute font-extrabold text-black/20 dark:text-white/20 animate-rise"
            style={{
              left: `${left}%`,
              bottom: "-200px",
              fontSize: `${60 + (i % 3) * 20}px`,
              animationDelay: `${delay}s`,
            }}
          >
            BVRITH
          </span>
        );
      })}
    </div>
  );
};

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden 
bg-gradient-to-br from-[#227d73] via-[#b7d8d3] to-[#227d73] 
dark:from-[#227d73] dark:via-[#0f2f2f] dark:to-[#227d73]">
  {/* 🔥 Floating Background */}
  <FloatingBvrith />
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary">
            <GraduationCap className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-extrabold text-teal-900 dark:text-teal-900">
  HirePath
</h1>
          <p className="mt-3 text-xl font-semibold text-black dark:text-white">
            Student Registration
          </p>
        </div>

        <Card className="backdrop-blur-lg bg-white/70 dark:bg-white/10 border border-white/20 shadow-xl">
          <CardHeader className="pb-4">
            <h2 className="text-3xl font-extrabold">Create Account</h2>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-3">
                <Label>Email</Label>
                <Input
                  placeholder="student@college.edu"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Password</Label>
                <Input
                  placeholder="Create a password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-xl text-primary-foreground"
              >
                Register
              </Button>

              <p className="text-center text-lg text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-primary hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
