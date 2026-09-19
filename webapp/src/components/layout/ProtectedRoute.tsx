import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '../ui/spinner';

interface ProtextedRouteProps {
  requireAuth: boolean
}

const ProtectedRoute = ({requireAuth = true}: ProtextedRouteProps) => {
  const {user, isLoading} = useAuth();

  if (isLoading) return <Spinner className='size-8' />

  // return (
  //   <Navigate to="/login" replace />
  // )

  return (
    <Outlet />
  )
}

export default ProtectedRoute;