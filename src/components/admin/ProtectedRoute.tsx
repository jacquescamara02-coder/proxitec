import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface Props {
  children: ReactNode;
  requireRole?: "admin" | "vendeur";
}

export const ProtectedRoute = ({ children, requireRole }: Props) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (requireRole && role !== requireRole) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "vendeur") return <Navigate to="/vendeur" replace />;
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
