
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function LandingPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const features = [
    'Criação de páginas de presell com um clique',
    'Pop-ups de alta conversão (idade, cookies, saída)',
    'Personalização completa de layout e cores',
    'Geração de HTML pronto para usar',
    'Ferramentas de Rastreamento (Pixel, Google Ads)',
    'Gerador de conteúdo com IA',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Image src="https://i.imgur.com/ihAZlua.png" alt="Konstrupages Logo" width={32} height={32} />
            Konstrupages
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" passHref>
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/login" passHref>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground hover:from-blue-600 hover:to-purple-700 transition-all">
                Começar de Graça
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tight">
              Crie Presells de Alta Conversão em Minutos
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              A ferramenta definitiva para afiliados e produtores digitais. Construa páginas de presell otimizadas sem precisar escrever uma linha de código.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/login" passHref>
                <Button size="lg" className="w-full sm:w-auto text-lg py-7 font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground hover:from-blue-600 hover:to-purple-700 transition-all">
                  Começar a Criar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <Image
              src="https://i.imgur.com/8aM5wML.png"
              alt="Editor do Konstrupages"
              width={1200}
              height={794}
              className="rounded-lg shadow-2xl border"
            />
          </div>
        </section>

        <section className="w-full py-20 md:py-32 bg-muted/40">
          <div className="container">
            <div className="flex flex-col items-center text-center gap-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Tudo que você precisa para converter</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Funcionalidades pensadas para maximizar seus resultados como afiliado.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary mt-1">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{feature}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-background border-t">
        <div className="container text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Konstrupages. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
