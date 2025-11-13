
'use client';

import React from 'react';
import { FirebaseProvider, auth, firebaseApp, firestore } from '.';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
