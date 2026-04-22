import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";

type Role = "student" | "admin";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  role: Role;
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  role: "student",
  isLoggedIn: false,
  user: null,
  login: async () => false,
  logout: () => {},
});

export const useRole = () => useContext(AuthContext);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>("student");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // 🔥 Restore user on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const parsedUser: User = JSON.parse(savedUser);

      setUser(parsedUser);
      setRole(parsedUser.role.toLowerCase() as Role);
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password }
      );

      if (response.data.success) {
        const backendUser = response.data;

        const formattedRole: Role =
          backendUser.role === "ADMIN" ? "admin" : "student";

        const userObject: User = {
          id: backendUser.id,
          name: backendUser.name,
          email: backendUser.email,
          role: backendUser.role,
        };

        setUser(userObject);
        setRole(formattedRole);
        setIsLoggedIn(true);

        localStorage.setItem("user", JSON.stringify(userObject));

        return true;
      }

      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setRole("student");
    setIsLoggedIn(false);
    setUser(null);

    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ role, isLoggedIn, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};