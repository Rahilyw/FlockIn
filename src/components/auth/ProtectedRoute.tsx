import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Use as a layout route: nest pages that require a signed-in user inside it.
 * Unauthenticated visitors are redirected to `/login` with `state.from` so
 * Login can send them back after a successful sign-in.
 */
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-10 w-3/4 max-w-xs" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
