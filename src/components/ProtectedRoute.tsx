import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// export interface ProtectedRouteProps {
//   children?: React.ReactNode;
// }

// export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const { user } = useSelector((state) => state.auth);
//   const location = useLocation();
//   if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
//   return children;
// };

export type ProtectedRouteProps = {
  isAllowed: boolean;
  redirectPath?: string;
  children?: React.ReactNode;
};

export const ProtectedRoute = ({
  isAllowed,
  redirectPath = '/login',
  children,
}: ProtectedRouteProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};
