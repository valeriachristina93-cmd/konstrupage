"use client";

import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const { logout } = useAuth();

  return (
    <header className="bg-background border-b px-4 sm:px-6 py-3 flex justify-between items-center sticky top-0 z-40">
      <h1 className="text-2xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
        Stallo
      </h1>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <span className="text-sm text-muted-foreground hidden sm:inline">Olá, Afiliado!</span>
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2 text-destructive" />
          Sair
        </Button>
      </div>
    </header>
  );
}
