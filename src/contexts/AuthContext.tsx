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
  {
    id: "USR-001",
    name: "Douglas Admin",
    email: "admin@agencia.com",
    role: "admin",
    created_at: "2024-01-01",
    active: true,
  },
  {
    id: "USR-002",
    name: "Ana Financeiro",
    email: "financeiro@agencia.com",
    role: "financeiro",
    created_at: "2024-02-15",
    active: true,
  },
  {
    id: "USR-003",
    name: "Carlos Suporte",
    email: "suporte@agencia.com",
    role: "suporte",
    created_at: "2024-03-01",
    active: true,
  },
  {
    id: "USR-004",
    name: "Julia Vendas",
    email: "vendedor@agencia.com",
    role: "vendedor",
    created_at: "2024-04-10",
    active: true,
  },
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
