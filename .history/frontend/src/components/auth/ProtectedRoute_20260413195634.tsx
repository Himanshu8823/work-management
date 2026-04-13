import React from 'react';
import { useCurrentAdmin } from '@/hooks/useQueries';
import { Navigate } from 'react-router-dom';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import { isAuthenticated } from '@/utils/helpers';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data, isLoading } = useCurrentAdmin();
  const hasAuth = isAuthenticated();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!hasAuth || !data?.success) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
