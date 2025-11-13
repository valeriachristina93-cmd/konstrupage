'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export interface FirebaseContextState {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(
  undefined
);

export function FirebaseProvider({
  children,
  firebaseApp,
  auth,
  firestore,
}: {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) {
  const contextValue = useMemo(
    () => ({ firebaseApp, auth, firestore }),
    [firebaseApp, auth, firestore]
  );
  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

export const useAuth = (): Auth => {
  return useFirebase().auth;
};

export const useFirestore = (): Firestore => {
  return useFirebase().firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  return useFirebase().firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}
