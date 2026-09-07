'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from '@/lib/api/authApi';
import { can as canHelper } from '@/lib/utils/permissions';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => { },
  logout: () => { },
  can: () => false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Restore session from localStorage on mount
    queueMicrotask(() => {
      try {
        const storedToken = localStorage.getItem('gold_erp_token');
        const storedUser = localStorage.getItem('gold_erp_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to load stored auth:', err);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('gold_erp_token', data.token);
        localStorage.setItem('gold_erp_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      throw new Error('Invalid authentication response');
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('gold_erp_token');
    localStorage.removeItem('gold_erp_user');
    router.push('/login');
  }, [router]);

  const can = useCallback(
    (permission) => {
      return canHelper(user, permission);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        can,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
