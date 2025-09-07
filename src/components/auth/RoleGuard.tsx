import React from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/dashboard/user' 
}) => {
  const currentUser = useSelector((state: any) => state.authUser.currentUser);
  const isAuthenticated = useSelector((state: any) => state.authUser.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (!allowedRoles.includes(currentUser.role)) {
        router.push(redirectTo);
      }
    }
  }, [currentUser, isAuthenticated, allowedRoles, redirectTo, router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <div>Access denied. Redirecting...</div>;
  }

  return <>{children}</>;
};

export default RoleGuard;
