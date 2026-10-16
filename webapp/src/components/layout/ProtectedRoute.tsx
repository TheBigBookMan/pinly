import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '../ui/spinner';
import type { AuthContextType } from '@/types/auth';
import { useSession } from '@/features/auth/hooks';
import { Button } from '../ui/button';
import { safeRedirect } from '@/lib/safeRedirect';

interface ProtectedRouteProps {
  requireAuth: boolean
}

const ProtectedRoute = ({ requireAuth = true }: ProtectedRouteProps) => {
  const session = useSession();
  const location = useLocation();
  
  if (session.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className='size-8' />
      </div>
    )
  }

  if (session.isError) {
    return (
      <div role="alert" className='flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center'>
        <p className='text-foreground'>Pinly cannot reach the server right now.</p>
        <Button onClick={() => void session.refetch()} disabled={session.isFetching}>
          Try again
        </Button>
      </div>
    )
  }

  const user = session.data;

  if (requireAuth && !user) {
    return <Navigate to="/login" replace state={{from: location.pathname + location.search}} />
  }

  if (!requireAuth && user) {
    const from = (location.state as {from?: unknown} | null)?.from;
    return <Navigate to={safeRedirect(from)} replace />
  }

  return <Outlet />;
};

export default ProtectedRoute;