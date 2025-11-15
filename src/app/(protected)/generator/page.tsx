'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot, FileText, Languages, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generatePage } from '@/lib/actions/generator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { GenerateCodeModal } from '@/components/editor/generate-code-modal';
import Image from 'next/image';

const languageOptions = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en-US', label: 'English' },
    { value: 'es-ES', label: 'Español' },
    { value: 'fr-FR', label: 'Français' },
    { value: 'de-DE', label: 'Deutsch' },
    { value: 'it-IT', label: 'Italiano' },
    { value: 'ja-JP', label: '日本語' },
    { value: 'zh-CN', label: '中文' },
];

export default function GeneratorPage() {
    const [pageType, setPageType] = useState('Review');
    const [productName, setProductName] = useState('');
    const [videoReviewLink, setVideoReviewLink] = useState('');
    const [salesPageLink, setSalesPageLink] = useState('');
    const [affiliateLink, setAffiliateLink] = useState('');
    const [description, setDescription] = useState('');
    const [advancedSettings, setAdvancedSettings] = useState('');
    const [language, setLanguage] = useState('pt-BR');
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();

    const handleGenerateWithAI = async () => {
        if (!productName || !salesPageLink || !affiliateLink) {
            toast({
                variant: 'destructive',
                title: 'Campos Obrigatórios',
                description: 'Por favor, preencha o Nome do Produto, Link da Página de Vendas e Link de Afiliado.',
            });
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generatePage({
                pageType,
                productName,
                videoReviewLink,
                salesPageLink,
                affiliateLink,
                description,
                advancedSettings,
                language,
            });
            setGeneratedPrompt(result);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error generating page:", error);
            toast({
                variant: "destructive",
                title: "Falha ao Gerar Prompt",
                description: "Ocorreu um erro ao tentar gerar o super prompt.",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-muted/30 text-foreground">
            <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 sticky top-0 z-40 gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" passHref>
                      <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </Link>
                    <div className="flex items-center gap-2 text-xl font-bold font-headline">
                        <Image src="https://i.imgur.com/ihAZlua.png" alt="Konstrupages Logo" width={24} height={24} />
                        <span className="hidden sm:inline-block">Gerador de Prompt</span>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
                    <Button
                        onClick={handleGenerateWithAI}
                        disabled={isGenerating}
                        size="lg"
                        className="font-bold text-base py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                        {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                        Gerar Super Prompt
                    </Button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bot className="h-6 w-6 text-primary" />
                                <span>Assistente de Geração de Página</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Preencha as informações abaixo para gerar um "Super Prompt". Este prompt detalhado pode ser usado em qualquer IA de sua preferência (ChatGPT, Gemini, Claude) para criar uma página de vendas ou review de alta qualidade.
                            </p>
                        </CardContent>
                    </Card>

                    <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4']} className="w-full space-y-4">
                        <AccordionItem value="item-1" className="border rounded-lg bg-card">
                            <AccordionTrigger className="hover:no-underline p-3 font-semibold text-sm w-full justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    <h3 className='font-semibold text-sm'>Informações do Produto</h3>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 border-t space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="productName">Nome do Produto <span className="text-red-500">*</span></Label>
                                    <Input id="productName" placeholder="Ex: Curso de Marketing Digital" value={productName} onChange={(e) => setProductName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pageType">Tipo de Página</Label>
                                    <Select value={pageType} onValueChange={setPageType}>
                                        <SelectTrigger id="pageType">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Review">Página de Review</SelectItem>
                                            <SelectItem value="Sales">Página de Vendas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Idioma</Label>
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger id="language">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {languageOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Descrição / Detalhes Adicionais</Label>
                                    <Textarea id="description" placeholder="Forneça detalhes, benefícios ou qualquer informação extra sobre o produto que a IA deve saber." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3" className="border rounded-lg bg-card">
                             <AccordionTrigger className="hover:no-underline p-3 font-semibold text-sm w-full justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    <h3 className='font-semibold text-sm'>Links Essenciais</h3>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 border-t space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="salesPageLink">Link da Página de Vendas (Fonte) <span className="text-red-500">*</span></Label>
                                    <Input id="salesPageLink" placeholder="https://..." value={salesPageLink} onChange={(e) => setSalesPageLink(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="affiliateLink">Link de Afiliado (CTA) <span className="text-red-500">*</span></Label>
                                    <Input id="affiliateLink" placeholder="https://..." value={affiliateLink} onChange={(e) => setAffiliateLink(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="videoReviewLink">Link do Vídeo Review (Opcional)</Label>
                                    <Input id="videoReviewLink" placeholder="https://youtube.com/..." value={videoReviewLink} onChange={(e) => setVideoReviewLink(e.target.value)} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4" className="border rounded-lg bg-card">
                             <AccordionTrigger className="hover:no-underline p-3 font-semibold text-sm w-full justify-between">
                                <div className="flex items-center gap-2">
                                    <Wand2 className="w-4 h-4" />
                                    <h3 className='font-semibold text-sm'>Configuração Avançada</h3>
                                </div>
                            </AccordionTrigger>
                             <AccordionContent className="p-4 border-t space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="advancedSettings">Instruções Extras para a IA</Label>
                                    <Textarea id="advancedSettings" placeholder="Ex: Use um tom mais formal. Adicione uma seção sobre a história da empresa. Foque no benefício X." value={advancedSettings} onChange={(e) => setAdvancedSettings(e.target.value)} rows={4} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                </div>
            </main>

            {isModalOpen && (
                <GenerateCodeModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    pageConfig={{ htmlContent: generatedPrompt, pageTitle: "Super Prompt Gerado" }}
                />
            )}
        </div>
    );
}
