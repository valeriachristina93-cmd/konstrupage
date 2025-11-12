
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen bg-muted/30">
            <header className="flex h-16 shrink-0 items-center border-b bg-background px-4 md:px-6 sticky top-0 z-40">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-xl font-bold ml-4 font-headline tracking-tight">Contato</h1>
            </header>

            <main className="flex-1 p-4 sm:p-6 md:p-8">
                <div className="max-w-xl mx-auto">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-6 w-6 text-primary" />
                                <span>Envie-nos uma Mensagem</span>
                            </CardTitle>
                            <CardDescription>
                                Tem alguma dúvida, sugestão ou precisa de suporte? Preencha o formulário abaixo e nossa equipe entrará em contato o mais breve possível.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Seu Nome</Label>
                                <Input id="name" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Seu Email</Label>
                                <Input id="email" type="email" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Sua Mensagem</Label>
                                <Textarea id="message" placeholder="Escreva sua mensagem aqui..." rows={6} />
                            </div>
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground hover:from-blue-600 hover:to-purple-700 transition-all">
                                <Send className="mr-2 h-4 w-4" />
                                Enviar Mensagem
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
