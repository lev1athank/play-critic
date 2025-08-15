'use client';

import { useEffect } from 'react';
import apiClient from '@/tool/axiosClient';
import { useActions } from '@/hooks/useActions';

const AuthChecker = () => {
  const { setUserData, clearUserData } = useActions();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiClient.get('/auth/verify');
        setUserData(data);
        console.log('[AuthChecker] Авторизован:', data);
      } catch (error) {
        clearUserData();
        console.log('[AuthChecker] Не авторизован');
      }
    })();
  }, []);

  return null;
};

export default AuthChecker;
