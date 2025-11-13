
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { FirebaseClientProvider } from '@/firebase';

// This context is now a shell. The actual auth state will come from FirebaseProvider.
const AuthContext = createContext<undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
        {children}
    </FirebaseClientProvider>
  );
}

// This hook is kept for compatibility but doesn't provide auth logic itself.
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This message can be updated to reflect the new structure.
    // "useAuth must be used within an AuthProvider" is still technically true.
  }
  // The actual auth logic will be handled by useUser from @/firebase/auth/use-user
  return {};
}
