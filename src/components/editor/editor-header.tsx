

"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Link as LinkIcon, Bell, Languages, Loader2, User, LogOut, Moon, Sun, Monitor, Smartphone, Check, Sparkles, ArrowLeft, Bot, Camera, ImageIcon, ImageUp, Scissors, BookOpen, Youtube, Heart } from 'lucide-react';
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
import { useAuth } from '@/firebase';
import { useLanguage } from '@/context/language-context';

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
    { name: 'Lightshot', url: 'https://chromewebstore.google.com/detail/captura-de-ecr%C3%A3-e-gravado/edlifbnjlicfpckhgjhflgkeeibhhcii', icon: <Camera /> },
    { name: 'Capturar Imagem da Página', url: 'https://chromewebstore.google.com/detail/capturar-imagem-da-p%C3%A1gina/mcbpblocgmgfnpjjppndjkmgjaogfceg', icon: <Camera /> },
    { name: 'GoFullPage', url: 'https://chromewebstore.google.com/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl', icon: <Camera /> },
    { name: 'iLoveIMG', url: 'https://www.iloveimg.com/pt', icon: <ImageIcon /> },
    { name: 'Image Compressor', url: 'https://imagecompressor.com/pt/', icon: <Scissors /> },
    { name: 'Gemini', url: 'https://gemini.google.com/app', icon: <Sparkles /> },
    { name: 'DeepSeek Chat', url: 'https://chat.deepseek.com/', icon: <Bot /> },
    { name: 'ChatGPT', url: 'https://chatgpt.com/', icon: <Bot /> },
    { name: 'Grok', url: 'https://grok.com/', icon: <Bot /> },
    { name: 'Upload Imgur', url: 'https://uploadimgur.com/', icon: <ImageUp /> },
    { name: 'Glasp Reader', url: 'https://glasp.co/reader', icon: <BookOpen /> },
    { name: 'Canal do Rogerio', url: 'https://www.youtube.com/@-rogerio.?sub_confirmation=1', icon: <Youtube /> },
    { name: 'Apoiar com um PIX', url: 'https://nubank.com.br/cobrar/twver/69169d01-6d2e-4e44-96c6-741e08ceaab0', icon: <Heart /> },
];

export function EditorHeader({ onGenerate, isGenerating, affiliateLink }: EditorHeaderProps) {
    const auth = useAuth();
    const { t, setLanguage, language } = useLanguage();

    const logout = () => {
        auth.signOut();
    };

    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 sticky top-0 z-40 gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" passHref>
                      <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/editor" className="flex items-center gap-2 text-xl font-bold font-headline">
                        <Image src="https://i.imgur.com/ihAZlua.png" alt="Konstrupages Logo" width={24} height={24} />
                         <span className="hidden sm:inline-block bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Konstrupages</span>
                    </Link>
                    <Badge variant="outline">BETA</Badge>
                </div>

                <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
                     <Button
                        onClick={onGenerate}
                        disabled={isGenerating || !affiliateLink}
                        size="lg"
                        className="font-bold text-base py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                        {isGenerating && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {t('generate_page')}
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
                                    <SheetTitle>{t('announcements')}</SheetTitle>
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
                                <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                                    <DropdownMenuRadioItem value="pt">Português</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="es">Español</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <ThemeToggle />

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <LinkIcon className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>{t('useful_tools')}</SheetTitle>
                                </SheetHeader>
                                 <div className="mt-4 space-y-2">
                                    {tools.map((tool) => (
                                        <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted transition-colors">
                                            <span className="text-primary">{tool.icon}</span>
                                            <span className="font-semibold flex-1">{tool.name}</span>
                                            <LinkIcon className="h-4 w-4 text-muted-foreground"/>
                                        </a>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <User className="h-6 w-6" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{t('my_account')}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link href="/profile" passHref>
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>{t('profile')}</span>
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>{t('logout')}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
        </header>
    );
}
