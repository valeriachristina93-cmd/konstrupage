"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
     return <div className="flex h-screen w-full items-center justify-center bg-background"><div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
  }

  return (
    <div className="min-h-screen bg-secondary">
      <main>{children}</main>
    </div>
  );
}
