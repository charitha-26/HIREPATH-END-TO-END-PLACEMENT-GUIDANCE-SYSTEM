import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "@/contexts/RoleContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useRole();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const success = await login(email, password);

    if (success) {
      const savedUser = localStorage.getItem("user");
      const role = savedUser ? JSON.parse(savedUser).role : null;

      toast({ title: "Login successful!" });

      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      toast({
        title: "Invalid credentials",
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
            College Placement Platform
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader className="pb-4 text-center">
            <h2 className="text-3xl font-extrabold">Sign In</h2>
            <p className="text-lg text-muted-foreground">
              Enter your credentials to continue
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
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
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-xl text-primary-foreground"
              >
                Sign In
              </Button>

              <p className="text-center text-lg text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-primary hover:underline"
                >
                  Register
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
