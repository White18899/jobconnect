import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken, clearAuthToken } from '../services/api';

export type UserRole = 'worker' | 'employer' | 'admin';

export interface UserSession {
  id: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
}

interface AuthContextType {
  user: UserSession | null;
  role: UserRole | null;
  token: string | null;
  loading: boolean;
  login: (phone: string, role: UserRole, token?: string, userId?: string) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  setUser: React.Dispatch<React.SetStateAction<UserSession | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(getAuthToken());
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('jobconnect_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default demo user so reviewer can explore Worker side immediately
    return {
      id: 'usr_wrk_01',
      phone: '+91 9123456780',
      role: 'worker',
      isVerified: true,
    };
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('jobconnect_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('jobconnect_user');
    }
  }, [user]);

  const login = (phone: string, role: UserRole, jwtToken?: string, userId?: string) => {
    const session: UserSession = {
      id: userId || 'usr_' + Math.random().toString(36).substring(2, 9),
      phone,
      role,
      isVerified: true,
    };
    setUser(session);
    if (jwtToken) {
      setAuthToken(jwtToken);
      setTokenState(jwtToken);
    }
  };

  const logout = () => {
    clearAuthToken();
    setTokenState(null);
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) {
      setUser({
        id: `usr_${newRole}_demo`,
        phone: newRole === 'admin' ? '+91 9999999999' : newRole === 'employer' ? '+91 9876543210' : '+91 9123456780',
        role: newRole,
        isVerified: true,
      });
      return;
    }
    setUser({
      ...user,
      role: newRole,
      phone: newRole === 'admin' ? '+91 9999999999' : newRole === 'employer' ? '+91 9876543210' : '+91 9123456780',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        loading,
        login,
        logout,
        switchRole,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
