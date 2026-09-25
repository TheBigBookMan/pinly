import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '../ui/spinner';
import type { AuthContextType } from '@/types/auth';

interface ProtectedRouteProps {
  requireAuth: boolean
}

const ProtectedRoute = ({ requireAuth = true }: ProtectedRouteProps) => {
  const { user, isLoading }: AuthContextType = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/homepage" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;