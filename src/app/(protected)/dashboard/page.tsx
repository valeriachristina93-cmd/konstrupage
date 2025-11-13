
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus, Sparkles, Bot, LayoutTemplate } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-8">
      <div className="w-full max-w-5xl transform -translate-y-[30px]">
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <Image src="https://i.imgur.com/ihAZlua.png" alt="Konstrupages Logo" width={80} height={80} />
          </div>
          <h1 className="text-5xl font-bold font-headline mb-2 text-foreground">
            Bem-vindo ao Konstrupages
          </h1>
          <p className="text-xl text-muted-foreground">Sua ferramenta para criar páginas de presell de alta conversão.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-lg mx-auto">
          <Card className="flex flex-col justify-between border-2 border-primary/20 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
            <div>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary text-xl font-bold">
                  <Sparkles className="h-7 w-7" />
                  <span>Páginas Presell Personalizadas</span>
                </CardTitle>
                <CardDescription className="pt-2 text-base">
                  Crie páginas do zero com controle total sobre imagens, pop-ups, redirecionamentos e muito mais.
                </CardDescription>
              </CardHeader>
            </div>
            <CardFooter>
              <Link href="/editor" className="w-full">
                <Button className="w-full font-bold text-lg py-6 group bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground hover:from-blue-600 hover:to-purple-700 transition-all">
                  Começar a Criar
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
