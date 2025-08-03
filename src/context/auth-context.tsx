// src/context/auth-context.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { checkAdminSession, logoutAdmin } from "@/lib/api";

interface AuthContextType {
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const res = await checkAdminSession();
    setIsAdmin(res.success && res.data?.isAdmin === true);
    setLoading(false);
  };

  const logout = async () => {
    await logoutAdmin(); // API call to clear cookie/session
    setIsAdmin(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, loading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
