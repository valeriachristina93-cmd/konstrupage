
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
        <header className="flex h-16 items-center border-b bg-background px-4 md:px-6 sticky top-0 z-40">
            <Link href="/dashboard" passHref>
                <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <h1 className="text-xl font-semibold ml-4">Perfil</h1>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
            <div className="max-w-md w-full">
                <Card className="shadow-lg">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-primary/30">
                                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User avatar" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl font-bold">Usuário Demo</CardTitle>
                                <CardDescription>demo@presell.pro</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <p className="font-medium">Status da Conta</p>
                                </div>
                                <Badge variant="secondary">Ativa</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
