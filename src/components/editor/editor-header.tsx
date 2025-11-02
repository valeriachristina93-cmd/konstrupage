
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Camera, Bell, Languages, Loader2, User, LogOut, Moon, Sun, Monitor, Smartphone, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useState } from 'react';
import { useAuth } from '@/context/auth-context';

interface EditorHeaderProps {
    onGenerate: () => void;
    isGenerating: boolean;
    affiliateLink: string;
}

const announcements = [
    { title: "Novo pop-up de saída!", description: "Aumente suas conversões com nossa nova funcionalidade de pop-up.", date: "2 dias atrás" },
    { title: "Integração com IA", description: "Sugestões de layout automáticas para otimizar suas páginas.", date: "1 semana atrás" },
];

const tools = [
    { name: 'Lightshot', url: 'https://app.prntscr.com/pt-br/index.html' },
    { name: 'ShareX', url: 'https://getsharex.com/' },
    { name: 'Gyazo', url: 'https://gyazo.com/pt' },
];

export function EditorHeader({ onGenerate, isGenerating, affiliateLink }: EditorHeaderProps) {
    const [language, setLanguage] = useState('pt-br');
    const { logout } = useAuth();

    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 sticky top-0 z-40 gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/editor" className="flex items-center gap-2 text-xl font-bold font-headline">
                        <Image src="https://i.imgur.com/ihAZlua.png" alt="Konstrupages Logo" width={24} height={24} />
                        <span className="hidden sm:inline-block">Konstrupages</span>
                    </Link>
                    <Badge variant="outline">BETA</Badge>
                </div>

                <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
                     <Button
                        onClick={onGenerate}
                        disabled={isGenerating || !affiliateLink}
                        size="lg"
                        className="font-bold text-base py-5 bg-gradient-to-r from-primary to-blue-500 text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                        {isGenerating && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        Gerar Página
                    </Button>

                    <div className="flex items-center gap-1 md:gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-1 right-1 flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary/80"></span>
                                    </span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Anúncios</SheetTitle>
                                </SheetHeader>
                                <div className="mt-4 space-y-4">
                                    {announcements.map((item, index) => (
                                        <div key={index} className="p-3 rounded-lg border bg-card">
                                            <p className="font-semibold">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                            <p className="text-xs text-muted-foreground mt-2">{item.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Languages className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Idioma</DropdownMenuLabel>
                                <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                                    <DropdownMenuRadioItem value="pt-br">
                                        Português (BR)
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="en-us">
                                        English (US)
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="es">
                                        Español
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <ThemeToggle />

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Camera className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Ferramentas de Captura</SheetTitle>
                                </SheetHeader>
                                 <div className="mt-4 space-y-2">
                                    {tools.map((tool) => (
                                        <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted transition-colors">
                                            <span className="font-semibold">{tool.name}</span>
                                            <Check className="h-4 w-4 text-green-500"/>
                                        </a>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@shadcn" />
                                        <AvatarFallback>SC</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Perfil</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sair</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
        </header>
    );
}
