
"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { FirebaseClientProvider } from '@/firebase';

interface AuthContextType {
  // These values are not used anymore but kept for compatibility
  // if other components depend on the type. The real source of truth is useUser().
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
  // The state management is now handled by the useUser hook directly in the components that need it.
  // This provider now only ensures the Firebase context is available.
  
  // Dummy values for context
  const authData: AuthContextType = {
    isLoggedIn: false,
    loading: true,
    user: null,
  };

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
  // The returned value is a dummy. Components should use `useUser` from `@/firebase` instead.
  return context;
}
