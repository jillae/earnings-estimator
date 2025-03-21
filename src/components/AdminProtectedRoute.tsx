
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Du måste logga in för att se admin-sidan');
    }
  }, [isLoggedIn]);
  
  if (!isLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return <>{children}</>;
};

export default AdminProtectedRoute;
