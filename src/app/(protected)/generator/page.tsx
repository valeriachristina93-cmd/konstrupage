
"use client";

import React, { useState, useCallback } from 'react';
import type { PageConfig, PostPageConfig } from '@/lib/definitions';
import { SettingsPanel } from '@/components/editor/settings-panel';
import { PreviewPanel } from '@/components/editor/preview-panel';
import { GenerateCodeModal } from '@/components/editor/generate-code-modal';
import { useToast } from '@/hooks/use-toast';
import { EditorHeader } from '@/components/editor/editor-header';
import type { ViewMode } from '@/app/(protected)/editor/page';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Bot, ArrowLeft, Link as LinkIcon, Download, Info, FileText, Upload, FileSignature, Newspaper, Star, Power, Settings, Copy, Check } from 'lucide-react';
import { generatePage, generatePageFromApi } from './actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


type PageType = 'Página presell robusta' | 'Página review' | 'Artigo estilo blog';

const GeneratedPromptModal = ({ isOpen, onClose, prompt }: { isOpen: boolean, onClose: () => void, prompt: string }) => {
    const [hasCopied, setHasCopied] = useState(false);
    const { toast } = useToast();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(prompt).then(() => {
            setHasCopied(true);
            toast({ title: "Copiado!", description: "O prompt gerado foi copiado para a área de transferência." });
            setTimeout(() => setHasCopied(false), 2000);
        }, (err) => {
            toast({ variant: "destructive", title: "Falha ao copiar", description: "Não foi possível copiar o prompt." });
            console.error('Could not copy text: ', err);
        });
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl w-full h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle>Super Prompt Gerado</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-grow px-6">
                    <pre className="bg-muted p-4 rounded-md text-sm text-foreground whitespace-pre-wrap break-all">
                        <code>{prompt}</code>
                    </pre>
                </ScrollArea>
                <DialogFooter className="p-6 pt-4 border-t">
                    <Button onClick={copyToClipboard} variant="secondary" className="w-full sm:w-auto">
                        {hasCopied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                        {hasCopied ? 'Copiado!' : 'Copiar Prompt'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function GeneratorPage() {
    const [pageConfig, setPageConfig] = useState<PageConfig | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const [isGeneratingFromApi, setIsGeneratingFromApi] = useState(false);

    // New state for the generated prompt
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
    
    // States for the generator form
    const [productName, setProductName] = useState('');
    const [videoReviewLink, setVideoReviewLink] = useState('');
    const [salesPageLink, setSalesPageLink] = useState('');
    const [affiliateLink, setAffiliateLink] = useState('');
    const [language, setLanguage] = useState('Português (Brasil)');
    const [description, setDescription] = useState('');
    const [pageType, setPageType] = useState<PageType>('Página review');

    // States for advanced settings
    const [facebookPixelId, setFacebookPixelId] = useState('');
    const [googleAdsId, setGoogleAdsId] = useState('');
    const [customHtml, setCustomHtml] = useState('');

    // States for API generation
    const [apiUrl, setApiUrl] = useState('');
    const [apiKey, setApiKey] = useState('');

    const { toast } = useToast();
    const [viewMode, setViewMode] = useState<ViewMode>('desktop');
    const [openAccordion, setOpenAccordion] = useState<string>('product-info');

    const handleConfigChange = useCallback((keys: (string | number)[], value: any) => {
        setPageConfig(prev => {
            if (!prev) return null;
            const newConfig = JSON.parse(JSON.stringify(prev));
            let currentLevel: any = newConfig;
            for (let i = 0; i < keys.length - 1; i++) {
                 const key = keys[i];
                if (currentLevel[key] === undefined && typeof keys[i+1] === 'number') {
                    currentLevel[key] = [];
                } else if (currentLevel[key] === undefined) {
                    currentLevel[key] = {};
                }
                currentLevel = currentLevel[key];
            }
            currentLevel[keys[keys.length - 1]] = value;
            return newConfig;
        });
    }, []);

    const addPostPage = () => {
        setPageConfig(prev => {
            if (!prev) return null;
            const newConfig = JSON.parse(JSON.stringify(prev));
            const newPost: PostPageConfig = {
                active: true,
                productName: `Novo Post ${newConfig.postPages.length + 1}`,
                content: 'Escreva o conteúdo do seu post aqui...',
                imageUrl: 'https://picsum.photos/seed/post1/800/400'
            };
            if (!newConfig.postPages) {
                newConfig.postPages = [];
            }
            newConfig.postPages.push(newPost);
            return newConfig;
        });
    };

    const removePostPage = (index: number) => {
        setPageConfig(prev => {
            if (!prev) return null;
            const newConfig = JSON.parse(JSON.stringify(prev));
            newConfig.postPages.splice(index, 1);
            return newConfig;
        });
    };

    const handleImageUpload = (file: File, keys: (string | number)[]) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target && typeof event.target.result === 'string') {
                handleConfigChange(keys, event.target.result);
            }
        };
        reader.readAsDataURL(file);
    };

    
    const handleGenerateWithAI = async () => {
        if (!description.trim() && !productName.trim()) {
          toast({
            variant: "destructive",
            title: "Descrição necessária",
            description: "Por favor, descreva a página que você deseja criar ou preencha os campos.",
          });
          return;
        }
    
        setIsGeneratingWithAI(true);

        const structuredPrompt = {
            pageType,
            productName,
            videoReviewLink,
            salesPageLink,
            affiliateLink,
            description,
            language,
            advancedSettings: {
                facebookPixelId,
                googleAdsId,
                customHtml
            }
        };


        try {
          const resultPrompt = await generatePage(structuredPrompt);
          setGeneratedPrompt(resultPrompt);
          setIsPromptModalOpen(true);
           toast({
            title: "Super Prompt Gerado!",
            description: "Seu prompt detalhado está pronto para ser copiado e usado.",
          });
        } catch (error) {
          console.error(error);
          toast({
            variant: "destructive",
            title: "Erro ao gerar o prompt",
            description: "Houve um problema ao montar o prompt. Tente novamente.",
          });
        } finally {
          setIsGeneratingWithAI(false);
        }
      };

    const handleGenerateFromApi = async () => {
        if (!apiUrl.trim()) {
            toast({
                variant: "destructive",
                title: "URL da API necessária",
                description: "Por favor, insira a URL da API para gerar a página.",
            });
            return;
        }

        setIsGeneratingFromApi(true);
        try {
            const result = await generatePageFromApi(apiUrl, apiKey);
             // Ensure postPages is an array even if the API doesn't return it
            if (!result.postPages) {
                result.postPages = [];
            }
            setPageConfig(result);
            toast({
                title: "Página Gerada via API!",
                description: "A estrutura da sua página foi criada a partir da API externa.",
            });
        } catch (error: any) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Erro ao gerar via API",
                description: error.message || "Houve um problema ao comunicar com a API.",
            });
        } finally {
            setIsGeneratingFromApi(false);
        }
    };


    const handleFinalGenerate = () => {
        if (!pageConfig?.affiliateLink) {
             toast({
                variant: "destructive",
                title: "Link de Afiliado Obrigatório",
                description: "Por favor, insira um link de afiliado para gerar a página.",
            });
            return;
        }
        setIsGenerating(true);
        setTimeout(() => {
            if (pageConfig) {
                setIsModalOpen(true);
            }
            setIsGenerating(false);
        }, 500);
    };

    if (pageConfig) {
        return (
            <div className="flex flex-col h-screen bg-muted/30 text-foreground">
                <EditorHeader 
                  onGenerate={handleFinalGenerate}
                  isGenerating={isGenerating}
                  affiliateLink={pageConfig?.affiliateLink || ''}
                />
                <main className="flex-1 flex flex-col md:flex-row gap-8 justify-center overflow-y-auto p-4 md:p-8">
                     <div className="w-full md:min-w-[400px] lg:min-w-[448px] md:max-w-[448px] flex flex-col bg-card shadow-sm border rounded-lg">
                        <SettingsPanel
                            pageConfig={pageConfig}
                            onConfigChange={handleConfigChange}
                            onImageUpload={handleImageUpload}
                            setViewMode={setViewMode}
                            addPostPage={addPostPage}
                            removePostPage={removePostPage}
                        />
                    </div>
                    
                     <div className="flex-1 flex flex-col relative min-h-[600px] md:min-h-0">
                        <PreviewPanel pageConfig={pageConfig} viewMode={viewMode} setViewMode={setViewMode} />
                    </div>
                </main>
                {isModalOpen && pageConfig && (
                    <GenerateCodeModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        pageConfig={pageConfig}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-muted/30 text-foreground">
             <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 sticky top-0 z-40 gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" passHref>
                      <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </Link>
                    <h1 className="text-xl font-semibold ml-1">Gerador de Prompt</h1>
                </div>
            </header>
            <main className="flex-1 flex flex-col md:flex-row gap-8 justify-center overflow-y-auto p-4 md:p-8">
                 <div className="w-full md:min-w-[400px] lg:min-w-[448px] md:max-w-[448px] flex flex-col bg-card shadow-sm border rounded-lg">
                    <div className="p-4 flex flex-col h-full">
                        <h2 className="text-lg font-semibold mb-4">Gerar Super Prompt</h2>
                        <div className="flex-1 flex flex-col">
                            <Accordion 
                                type="single" 
                                collapsible 
                                className="w-full space-y-2"
                                value={openAccordion}
                                onValueChange={setOpenAccordion}
                            >
                                <AccordionItem value="product-info" className="border-b">
                                    <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm w-full justify-between">
                                        <div className="flex items-center gap-2">
                                            <Info className="w-4 h-4 text-primary/80" />
                                            <span>Informações do Produto</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 mt-2 border-t space-y-4 px-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="language">Idioma</Label>
                                            <Select value={language} onValueChange={setLanguage}>
                                                <SelectTrigger id="language">
                                                    <SelectValue placeholder="Selecione o idioma" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Português (Brasil)">Português (Brasil)</SelectItem>
                                                    <SelectItem value="English">English</SelectItem>
                                                    <SelectItem value="Español">Español</SelectItem>
                                                    <SelectItem value="Français">Français</SelectItem>
                                                    <SelectItem value="Deutsch">Deutsch</SelectItem>
                                                    <SelectItem value="Italiano">Italiano</SelectItem>
                                                    <SelectItem value="日本語">日本語</SelectItem>
                                                    <SelectItem value="中文">中文</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="productName">Nome do Produto</Label>
                                            <Input id="productName" placeholder="Ex: Slim Caps" value={productName} onChange={(e) => setProductName(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="videoReviewLink">Link do Vídeo de Review (Opcional)</Label>
                                            <Input id="videoReviewLink" type="url" placeholder="https://youtube.com/watch?v=..." value={videoReviewLink} onChange={(e) => setVideoReviewLink(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="salesPageLink">Link da Página de Vendas (Opcional)</Label>
                                            <Input id="salesPageLink" type="url" placeholder="https://pagina-de-vendas.com" value={salesPageLink} onChange={(e) => setSalesPageLink(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="affiliateLink">Link de Afiliado (Opcional)</Label>
                                            <Input id="affiliateLink" type="url" placeholder="https://seu-link-de-afiliado.com" value={affiliateLink} onChange={(e) => setAffiliateLink(e.target.value)} />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                    <AccordionItem value="content-source" className="border-b">
                                    <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm w-full justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-primary/80" />
                                            <span>Fonte de Conteúdo</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 mt-2 border-t space-y-4 px-3">
                                        
                                        <div className="space-y-2 flex-1 flex flex-col">
                                            <Label htmlFor="description">
                                            Descreva a página (ou cole o conteúdo)
                                            </Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Ex: Uma página de presell para um produto de emagrecimento chamado 'Slim Caps'. Use uma imagem de uma pessoa feliz e saudável. O pop-up deve ser de verificação de idade."
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="min-h-[150px] flex-1"
                                            />
                                            <p className="text-sm text-muted-foreground pt-1">
                                                Seja o mais descritivo possível. Você pode colar o conteúdo ou extrair de uma URL.
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="advanced-settings" className="border-b">
                                    <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm w-full justify-between">
                                        <div className="flex items-center gap-2">
                                            <Settings className="w-4 h-4 text-primary/80" />
                                            <span>Configuração Avançada</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 mt-2 border-t space-y-4 px-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="facebookPixelId">ID do Pixel do Facebook</Label>
                                            <Input id="facebookPixelId" placeholder="Cole apenas o número de ID" value={facebookPixelId} onChange={(e) => setFacebookPixelId(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="googleAdsId">ID da Tag do Google (Google Ads)</Label>
                                            <Input id="googleAdsId" placeholder="Ex: AW-123456789" value={googleAdsId} onChange={(e) => setGoogleAdsId(e.target.value)} />
                                        </div>
                                        <div className="space-y-2 flex-1 flex flex-col">
                                            <Label htmlFor="customHtml">HTML/CSS/JS Personalizado</Label>
                                            <Textarea
                                                id="customHtml"
                                                placeholder="<style>...</style> ou <script>...</script>"
                                                value={customHtml}
                                                onChange={(e) => setCustomHtml(e.target.value)}
                                                className="min-h-[100px] flex-1 font-mono"
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="api-source" className="border-b-0">
                                    <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm w-full justify-between">
                                        <div className="flex items-center gap-2">
                                            <Power className="w-4 h-4 text-primary/80" />
                                            <span>Gerar com API Externa</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 mt-2 border-t space-y-4 px-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="apiUrl">URL da API</Label>
                                            <Input id="apiUrl" type="url" placeholder="https://sua-api.com/gerar-pagina" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="apiKey">Chave da API (Opcional)</Label>
                                            <Input id="apiKey" type="password" placeholder="Cole sua Bearer Token aqui" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                                        </div>
                                        <Button
                                            onClick={handleGenerateFromApi}
                                            disabled={isGeneratingFromApi}
                                            className="w-full"
                                        >
                                            {isGeneratingFromApi ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Gerando...
                                                </>
                                            ) : (
                                                <>
                                                    <Power className="mr-2 h-5 w-5" />
                                                    Gerar via API
                                                </>
                                            )}
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                                <div className="mt-auto pt-4">
                                    <Button
                                    onClick={handleGenerateWithAI}
                                    disabled={isGeneratingWithAI || isExtracting}
                                    size="lg"
                                    className="w-full font-bold text-lg py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground hover:from-blue-600 hover:to-purple-700"
                                >
                                    {isGeneratingWithAI ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Gerando...
                                    </>
                                    ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Gerar Super Prompt
                                    </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                
                 <div className="flex-1 flex flex-col relative min-h-[600px] md:min-h-0">
                    <div className="flex-1 flex flex-col items-center justify-center bg-muted/40 h-full rounded-lg border p-8 text-center">
                        <h3 className="text-xl font-semibold mb-6">Qual tipo de página você quer criar?</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 w-full max-w-2xl">
                            <Card 
                                className={cn("text-left cursor-pointer hover:border-primary transition-colors", pageType === 'Página presell robusta' && 'border-primary ring-2 ring-primary')}
                                onClick={() => setPageType('Página presell robusta')}
                            >
                                <CardContent className="p-4">
                                    <FileSignature className="w-6 h-6 mb-2 text-primary" />
                                    <h4 className="font-semibold">Presell Robusta</h4>
                                    <p className="text-xs text-muted-foreground">Página completa com vários pop-ups e opções de interação.</p>
                                </CardContent>
                            </Card>
                            <Card 
                                className={cn("text-left cursor-pointer hover:border-primary transition-colors", pageType === 'Página review' && 'border-primary ring-2 ring-primary')}
                                onClick={() => setPageType('Página review')}
                            >
                                <CardContent className="p-4">
                                    <Star className="w-6 h-6 mb-2 text-primary" />
                                    <h4 className="font-semibold">Página de Review</h4>
                                    <p className="text-xs text-muted-foreground">Focada em uma análise detalhada do produto com provas sociais.</p>
                                </CardContent>
                            </Card>
                            <Card 
                                className={cn("text-left cursor-pointer hover:border-primary transition-colors", pageType === 'Artigo estilo blog' && 'border-primary ring-2 ring-primary')}
                                onClick={() => setPageType('Artigo estilo blog')}
                            >
                                <CardContent className="p-4">
                                    <Newspaper className="w-6 h-6 mb-2 text-primary" />
                                    <h4 className="font-semibold">Artigo de Blog</h4>
                                    <p className="text-xs text-muted-foreground">Conteúdo informativo que leva a uma oferta no final.</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="text-center text-muted-foreground">
                            <Bot size={48} className="mx-auto mb-4" />
                            <h3 className="text-xl font-semibold">Aguardando suas informações...</h3>
                            <p>Preencha os campos ao lado para gerar o seu Super Prompt.</p>
                        </div>
                    </div>
                </div>
            </main>
            {isPromptModalOpen && (
                <GeneratedPromptModal
                    isOpen={isPromptModalOpen}
                    onClose={() => setIsPromptModalOpen(false)}
                    prompt={generatedPrompt}
                />
            )}
        </div>
    );
}

    

    