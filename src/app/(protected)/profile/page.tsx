
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, CheckCircle, CreditCard, Bell, LogOut, Brush, Palette } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
    const { logout } = useAuth();
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
        <header className="flex h-16 shrink-0 items-center border-b bg-background px-4 md:px-6 sticky top-0 z-40">
            <Link href="/dashboard" passHref>
                <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <h1 className="text-xl font-bold ml-4 font-headline tracking-tight">Perfil</h1>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8">
            <div className="max-w-3xl mx-auto grid gap-8">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Avatar className="h-20 w-20 border-2 border-primary/50">
                            <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User avatar" />
                            <AvatarFallback className="text-2xl">U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <CardTitle className="text-2xl font-bold">Usuário Demo</CardTitle>
                            <CardDescription>demo@presell.pro</CardDescription>
                            <div className="mt-2 flex items-center gap-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                    Ativo
                                </Badge>
                                <Badge variant="secondary">Plano Gratuito</Badge>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                 <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            <span>Informações Pessoais</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Nome</span>
                            <span className="font-medium">Usuário Demo</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Email</span>
                            <span className="font-medium">demo@presell.pro</span>
                        </div>
                    </CardContent>
                </Card>
                
                 <Card className="shadow-sm">
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            <span>Preferências</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Tema</span>
                            <span className="font-medium">Escuro</span>
                        </div>
                        <Separator />
                         <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Idioma</span>
                            <span className="font-medium">Português (Brasil)</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-destructive/50">
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2 text-destructive">
                            <LogOut className="h-5 w-5" />
                            <span>Sair da Conta</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground">Ao sair, você precisará fazer login novamente para acessar suas páginas e configurações.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="destructive" onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Sair
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </main>
    </div>
  );
}
