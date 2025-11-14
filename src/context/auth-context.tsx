
"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { FirebaseClientProvider, useUser as useFirebaseUser } from '@/firebase';

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  user: any; 
}

// This context is now a shell. The actual auth state will come from FirebaseProvider.
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  loading: true,
  user: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useFirebaseUser();
  const [authData, setAuthData] = useState<AuthContextType>({
    isLoggedIn: !!user,
    loading: isUserLoading,
    user: user,
  });

  useEffect(() => {
    setAuthData({
        isLoggedIn: !!user,
        loading: isUserLoading,
        user: user,
    });
  }, [user, isUserLoading]);

  return (
    <FirebaseClientProvider>
        <AuthContext.Provider value={authData}>
            {children}
        </AuthContext.Provider>
    </FirebaseClientProvider>
  );
}

// This hook is kept for compatibility but doesn't provide auth logic itself.
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
