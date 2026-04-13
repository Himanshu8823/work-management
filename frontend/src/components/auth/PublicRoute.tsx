import React from 'react';
import { isAuthenticated } from '@/utils/helpers';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const hasAuth = isAuthenticated();

  if (hasAuth) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
