
"use client";

import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait for user status to be determined
    }

    if (!user) {
      // Not logged in, redirect to login
      router.push('/login');
      return;
    }

    if (!user.emailVerified) {
      // Logged in but email not verified, redirect to verification page
      router.push(`/verify-email?email=${encodeURIComponent(user.email || '')}`);
      return;
    }

  }, [user, isUserLoading, router]);

  if (isUserLoading || !user || !user.emailVerified) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
     );
  }

  return <>{children}</>;
}

    