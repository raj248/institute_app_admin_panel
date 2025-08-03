import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { LoginForm } from "@/components/login-form";

export default function Login() {
  const { isAdmin, loading } = useAuth();

  if (loading) return null; // or a spinner if desired

  console.warn("[isadmin]", isAdmin ?? "false")
  if (isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
