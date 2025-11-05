
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { ArrowLeft, User, Mail, Sun, Moon, Monitor } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();

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

        <main className="flex-1 p-4 md:p-8 lg:p-12">
            <div className="max-w-3xl mx-auto">
                <Card className="shadow-lg">
                    <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6">
                        <Avatar className="h-24 w-24 border-4 border-primary/20">
                            <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User avatar" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <CardTitle className="text-3xl font-bold">Usuário Demo</CardTitle>
                            <CardDescription className="text-base text-muted-foreground mt-1">demo@presell.pro</CardDescription>
                        </div>
                         <Button>Alterar Foto</Button>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Separator />
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Configurações da Conta</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input id="name" defaultValue="Usuário Demo" className="pl-10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                     <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input id="email" type="email" defaultValue="demo@presell.pro" className="pl-10" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button>Salvar Alterações</Button>
                                </div>
                            </div>
                        </div>
                        <Separator className="my-8" />
                         <div>
                            <h3 className="text-lg font-semibold mb-4">Preferências de Tema</h3>
                            <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Label htmlFor="light" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                    <RadioGroupItem value="light" id="light" className="sr-only" />
                                    <Sun className="h-6 w-6 mb-2" />
                                    <span>Claro</span>
                                </Label>
                                <Label htmlFor="dark" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                    <RadioGroupItem value="dark" id="dark" className="sr-only" />
                                    <Moon className="h-6 w-6 mb-2" />
                                    <span>Escuro</span>
                                </Label>
                                <Label htmlFor="system" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                    <RadioGroupItem value="system" id="system" className="sr-only" />
                                    <Monitor className="h-6 w-6 mb-2" />
                                    <span>Sistema</span>
                                </Label>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
