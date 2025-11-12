
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen bg-muted/30">
            <header className="flex h-16 shrink-0 items-center border-b bg-background px-4 md:px-6 sticky top-0 z-40">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-xl font-bold ml-4 font-headline tracking-tight">Política de Privacidade</h1>
            </header>

            <main className="flex-1 p-4 sm:p-6 md:p-8">
                <div className="max-w-3xl mx-auto">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Nossa Política de Privacidade</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-muted-foreground">
                            <p><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
                            
                            <p>A sua privacidade é importante para nós. É política do Konstrupages respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Konstrupages, e outros sites que possuímos e operamos.</p>
                            
                            <h3 className="text-lg font-semibold text-foreground pt-4">1. Coleta de Informações</h3>
                            <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>

                            <h3 className="text-lg font-semibold text-foreground pt-4">2. Uso de Dados</h3>
                            <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas и roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>

                            <h3 className="text-lg font-semibold text-foreground pt-4">3. Compartilhamento de Informações</h3>
                            <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.</p>

                            <h3 className="text-lg font-semibold text-foreground pt-4">4. Links Externos</h3>
                            <p>O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que не temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.</p>
                            
                            <h3 className="text-lg font-semibold text-foreground pt-4">5. Seus Direitos</h3>
                            <p>Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.</p>

                            <p className="pt-4">O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco.</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
