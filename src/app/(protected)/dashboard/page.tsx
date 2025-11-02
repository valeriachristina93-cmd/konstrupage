"use client";

import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h2 className="text-3xl font-bold font-headline mb-8 text-foreground">Seu Painel</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href="/editor" className="block group">
          <Card className="h-full hover:border-primary/80 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-primary">
                <span>Páginas Personalizadas</span>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </CardTitle>
              <CardDescription>
                Crie páginas de presell do zero com controle total sobre imagens, pop-ups e redirecionamentos.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Card className="h-full bg-muted/50 cursor-not-allowed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Páginas de Reviews (Em Breve)</CardTitle>
            <CardDescription>
              Utilize templates otimizados para reviews de produtos e gere mais confiança.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
