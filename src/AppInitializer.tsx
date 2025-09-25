import { AuthUser, RestoreSessionRequest } from 'auth/types';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/store';
import { restoreSession } from './auth/actions/restoreSession';
import { LoadingDots } from './components/LoadingDots';
import { getUserStorage } from './utils/auth';

export interface AppInitializerProps {
  children?: React.ReactNode;
}

export const AppInitializer = ({ children }: AppInitializerProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, user, success } = useAppSelector((state) => state.auth);

  const isNavigatingRef = useRef(false);

  useEffect(() => {
    if (user) return;

    const userInfo: AuthUser | null = getUserStorage();

    const restoreSessionParams: RestoreSessionRequest = {
      session: {
        access_token: userInfo?.access_token || '',
        refresh_token: userInfo?.refresh_token || '',
      },
    };
    dispatch(restoreSession(restoreSessionParams));
  }, [user]);

  useEffect(() => {
    if (error && !isNavigatingRef.current) {
      isNavigatingRef.current = true;
      navigate('/login');
    }
  }, [error, navigate]);

  if (loading || (!loading && !user && !error && !success)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-lg">
          <LoadingDots />
        </div>
      </div>
    );
  }

  return children;
};
