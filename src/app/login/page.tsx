
"use client";

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/dashboard');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };
  
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-primary/10">
        <CardHeader className="text-center space-y-4">
          <Image 
            src="https://i.imgur.com/ihAZlua.png" 
            alt="Konstrupages Logo" 
            width={60} 
            height={60}
            className="mx-auto" 
          />
          <div>
            <h1 className="text-5xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Konstrupages</h1>
            <CardDescription className="pt-2">Crie presell pages de alta conversão em minutos.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@exemplo.com" required defaultValue="demo@presell.pro" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="••••••••" required defaultValue="password" />
            </div>
            <Button type="submit" className="w-full font-semibold text-lg py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground hover:from-blue-600 hover:to-purple-700 transition-all">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
