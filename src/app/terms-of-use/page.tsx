
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TermsOfUsePage() {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen bg-muted/30">
            <header className="flex h-16 shrink-0 items-center border-b bg-background px-4 md:px-6 sticky top-0 z-40">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-xl font-bold ml-4 font-headline tracking-tight">Termos de Uso</h1>
            </header>

            <main className="flex-1 p-4 sm:p-6 md:p-8">
                <div className="max-w-3xl mx-auto">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Nossos Termos de Uso</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-muted-foreground">
                            <p><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
                            
                            <h3 className="text-lg font-semibold text-foreground pt-4">1. Termos</h3>
                            <p>Ao acessar ao site Konstrupages, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.</p>
                            
                            <h3 className="text-lg font-semibold text-foreground pt-4">2. Uso de Licença</h3>
                            <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Konstrupages, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você не pode: modificar ou copiar os materiais; usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial); tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Konstrupages; remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou transferir os materiais para outra pessoa ou 'espelhe' os materiais em qualquer outro servidor.</p>

                            <h3 className="text-lg font-semibold text-foreground pt-4">3. Isenção de responsabilidade</h3>
                            <p>Os materiais no site da Konstrupages são fornecidos 'como estão'. Konstrupages não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</p>

                            <h3 className="text-lg font-semibold text-foreground pt-4">4. Limitações</h3>
                            <p>Em nenhum caso o Konstrupages ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Konstrupages, mesmo que Konstrupages ou um representante autorizado da Konstrupages tenha sido notificado oralmente ou por escrito da possibilidade de tais danos.</p>
                            
                            <h3 className="text-lg font-semibold text-foreground pt-4">Modificações</h3>
                            <p>O Konstrupages pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
