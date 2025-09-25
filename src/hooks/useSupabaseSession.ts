import { useAppDispatch } from '../app/store';
import { useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { loginUser } from '../auth/actions/login';

export const useSupabaseSession = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedSession =
          JSON.parse(localStorage.getItem('supabaseSession')) ||
          JSON.parse(sessionStorage.getItem('supabaseSession'));

        if (savedSession) {
          await supabase.auth.setSession(savedSession);
          if (savedSession.user) {
            dispatch({
              type: loginUser.fulfilled.type,
              payload: savedSession.user,
            });
          }
        }
      } catch (error) {
        console.error('Error restoring Supabase session:', error.message);
        alert('Không thể restore session. Vui lòng đăng nhập lại.');
      }
    };

    restoreSession();
  }, [dispatch]);
};
