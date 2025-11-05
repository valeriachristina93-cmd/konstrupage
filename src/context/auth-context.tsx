"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This effect runs only once on the client to check the initial auth state.
    const storedAuth = localStorage.getItem('isLoggedIn');
    if (storedAuth === 'true') {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);
  
  useEffect(() => {
    // This effect runs whenever the login state, path, or loading state changes.
    if (loading) {
      return; // Don't do anything while loading
    }
    if (isLoggedIn && pathname === '/login') {
      router.replace('/dashboard');
    }
    if (!isLoggedIn && pathname !== '/login') {
      router.replace('/login');
    }
  }, [isLoggedIn, pathname, router, loading]);

  const login = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    // The useEffect above will handle the redirect
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    // The useEffect above will handle the redirect
  };

  if(loading) {
    return <div className="flex h-screen w-full items-center justify-center bg-background"><div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
