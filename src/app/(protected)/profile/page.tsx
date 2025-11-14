
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, User, CheckCircle, LogOut, Palette, Loader2, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { Separator } from '@/components/ui/separator';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
}

export default function ProfilePage() {
    const auth = useAuth();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user && firestore) {
                try {
                    const userDocRef = doc(firestore, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        setUserProfile(userDoc.data() as UserProfile);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            }
            setIsLoadingProfile(false);
        };

        if (!isUserLoading) {
            fetchUserProfile();
        }
    }, [user, isUserLoading, firestore]);

    const logout = () => {
        auth.signOut();
    };

    if (isUserLoading || isLoadingProfile) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        // This can happen briefly during redirection, so we show a loader as well.
        return (
             <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
  
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
                                <AvatarImage src={user?.photoURL || ''} alt="User avatar" />
                                <AvatarFallback className="text-2xl">{userProfile?.name ? userProfile.name.charAt(0) : 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-2xl font-bold">{userProfile?.name || 'Usuário'}</CardTitle>
                                <CardDescription>{userProfile?.email || 'email@example.com'}</CardDescription>
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
                                <span className="font-medium">{userProfile?.name || '-'}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Email</span>
                                <span className="font-medium">{userProfile?.email || '-'}</span>
                            </div>
                             <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Telefone</span>
                                <span className="font-medium">{userProfile?.phone || '-'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-pink-500/30 bg-pink-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-pink-500">
                                <Heart className="h-5 w-5" />
                                <span>Apoie o Projeto</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                O Konstrupages é uma ferramenta gratuita. Se ela te ajuda, considere fazer uma doação de qualquer valor para apoiar o desenvolvimento e manter o projeto no ar. Sua ajuda é muito importante!
                            </p>
                        </CardContent>
                        <CardFooter>
                            <a href="https://nubank.com.br/cobrar/twver/69169d01-6d2e-4e44-96c6-741e08ceaab0" target="_blank" rel="noopener noreferrer" className="w-full">
                                <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white dark:text-white">
                                    <Heart className="mr-2 h-4 w-4" />
                                    Fazer uma Doação
                                </Button>
                            </a>
                        </CardFooter>
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
