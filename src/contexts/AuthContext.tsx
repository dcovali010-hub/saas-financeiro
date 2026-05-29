"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: User[] = [
  { id: "USR-001", name: "Marcus Rivera", email: "admin@goldenfork.com", role: "admin", created_at: "2023-01-01", active: true },
  { id: "USR-002", name: "Sofia Chen", email: "gerente@goldenfork.com", role: "gerente", created_at: "2023-03-15", active: true },
  { id: "USR-003", name: "Jake Morrison", email: "garcom@goldenfork.com", role: "garcom", created_at: "2023-06-01", active: true },
  { id: "USR-005", name: "Chef Marco Vitale", email: "cozinha@goldenfork.com", role: "cozinha", created_at: "2023-01-15", active: true },
  { id: "USR-006", name: "Emma Walsh", email: "caixa@goldenfork.com", role: "caixa", created_at: "2024-01-20", active: true },
  { id: "USR-007", name: "Table 5 Guest", email: "mesa5@goldenfork.com", role: "cliente", created_at: "2025-05-29", active: true, table_id: "TBL-005" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("saas_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("saas_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const found = DEMO_USERS.find(
      (u) => u.email === email && password === "123456"
    );
    if (found) {
      setUser(found);
      localStorage.setItem("saas_user", JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("saas_user");
  };

  const hasPermission = (roles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === "admin") return true;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
