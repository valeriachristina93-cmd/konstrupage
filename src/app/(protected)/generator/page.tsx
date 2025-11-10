
"use client";

import React, { useState, useCallback, useTransition } from 'react';
import type { PageConfig, PostPageConfig } from '@/lib/definitions';
import { initialPageConfig } from '@/lib/constants';
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
import { Loader2, Sparkles, Bot, ArrowLeft, Link as LinkIcon, Download } from 'lucide-react';
import { generatePage, extractContentFromUrl } from './actions';
import Link from 'next/link';

export default function GeneratorPage() {
    const [pageConfig, setPageConfig] = useState<PageConfig | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    
    // States for the generator form
    const [productName, setProductName] = useState('');
    const [videoReviewLink, setVideoReviewLink] = useState('');
    const [salesPageLink, setSalesPageLink] = useState('');
    const [affiliateLink, setAffiliateLink] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');

    const { toast } = useToast();
    const [viewMode, setViewMode] = useState<ViewMode>('desktop');

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

    const handleExtract = async () => {
        if (!url.trim()) {
            toast({
                variant: 'destructive',
                title: 'URL necessária',
                description: 'Por favor, insira uma URL para extrair o conteúdo.'
            });
            return;
        }

        setIsExtracting(true);
        try {
            const result = await extractContentFromUrl(url);
            let combinedContent = result.textContent;
            if (result.imageUrls && result.imageUrls.length > 0) {
                combinedContent += `\n\nImagens encontradas na página:\n${result.imageUrls.join('\n')}`;
            }
            setDescription(combinedContent);
            toast({
                title: 'Conteúdo Extraído!',
                description: 'O texto e os links de imagem foram preenchidos. Revise antes de gerar a página.'
            });
        } catch (error: any) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Erro ao extrair conteúdo',
                description: error.message || 'Não foi possível buscar o conteúdo da URL fornecida.',
            });
        } finally {
            setIsExtracting(false);
        }
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

        const fullDescription = `
            Nome do Produto: ${productName}
            Link do Vídeo de Review: ${videoReviewLink}
            Link da Página de Vendas: ${salesPageLink}
            Link de Afiliado Principal: ${affiliateLink}

            Descrição Detalhada/Conteúdo Extraído:
            ${description}
        `;


        try {
          const result = await generatePage(fullDescription);
          // Ensure postPages is an array even if the AI doesn't return it
          if (!result.postPages) {
            result.postPages = [];
          }
          if(affiliateLink) {
            result.affiliateLink = affiliateLink;
          }
          setPageConfig(result);
           toast({
            title: "Página Gerada com Sucesso!",
            description: "A estrutura da sua página foi criada pela IA. Ajuste como desejar.",
          });
        } catch (error) {
          console.error(error);
          toast({
            variant: "destructive",
            title: "Erro ao gerar a página",
            description: "Houve um problema com a IA. Tente novamente mais tarde.",
          });
        } finally {
          setIsGeneratingWithAI(false);
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

    return (
        <div className="flex flex-col h-screen bg-muted/30 text-foreground">
            <EditorHeader 
              onGenerate={handleFinalGenerate}
              isGenerating={isGenerating}
              affiliateLink={pageConfig?.affiliateLink || ''}
            />
            <main className="flex-1 flex flex-col md:flex-row gap-8 justify-center overflow-y-auto p-4 md:p-8">
                 <div className="w-full md:min-w-[400px] lg:min-w-[448px] md:max-w-[448px] flex flex-col bg-card shadow-sm border rounded-lg">
                    {pageConfig ? (
                        <SettingsPanel
                            pageConfig={pageConfig}
                            onConfigChange={handleConfigChange}
                            onImageUpload={handleImageUpload}
                            setViewMode={setViewMode}
                            addPostPage={addPostPage}
                            removePostPage={removePostPage}
                        />
                    ) : (
                        <div className="p-4 flex flex-col h-full">
                            <h2 className="text-lg font-semibold mb-4">Gerar Página com IA</h2>
                            <Card className="shadow-lg flex-1 flex flex-col">
                                <CardContent className="p-6 flex-1 flex flex-col">
                                    <div className="space-y-4 flex-1 flex flex-col">
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="productName" className="text-base font-medium">Nome do Produto</Label>
                                            <Input id="productName" placeholder="Ex: Slim Caps" value={productName} onChange={(e) => setProductName(e.target.value)} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="videoReviewLink" className="text-base font-medium">Link do Vídeo de Review (Opcional)</Label>
                                            <Input id="videoReviewLink" type="url" placeholder="https://youtube.com/watch?v=..." value={videoReviewLink} onChange={(e) => setVideoReviewLink(e.target.value)} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="salesPageLink" className="text-base font-medium">Link da Página de Vendas (Opcional)</Label>
                                            <Input id="salesPageLink" type="url" placeholder="https://pagina-de-vendas.com" value={salesPageLink} onChange={(e) => setSalesPageLink(e.target.value)} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="affiliateLink" className="text-base font-medium">Link de Afiliado (Opcional)</Label>
                                            <Input id="affiliateLink" type="url" placeholder="https://seu-link-de-afiliado.com" value={affiliateLink} onChange={(e) => setAffiliateLink(e.target.value)} />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="url" className="text-base font-medium">Extrair de URL (Opcional)</Label>
                                            <div className="flex gap-2">
                                                <Input 
                                                    id="url"
                                                    type="url"
                                                    placeholder="Cole a URL de um artigo ou página de produto"
                                                    value={url}
                                                    onChange={(e) => setUrl(e.target.value)}
                                                    className="flex-1"
                                                    disabled={isExtracting}
                                                />
                                                <Button
                                                    variant="secondary"
                                                    onClick={handleExtract}
                                                    disabled={isExtracting}
                                                    aria-label="Extrair Conteúdo da URL"
                                                >
                                                    {isExtracting ? <Loader2 className="h-5 w-5 animate-spin"/> : <Download className="h-5 w-5" />}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2 flex-1 flex flex-col">
                                            <Label htmlFor="description" className="text-base font-medium">
                                            Descreva a página que você precisa (ou cole o conteúdo)
                                            </Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Ex: Uma página de presell para um produto de emagrecimento chamado 'Slim Caps'. Use uma imagem de uma pessoa feliz e saudável. O pop-up deve ser de verificação de idade."
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="min-h-[120px] text-base flex-1"
                                            />
                                            <p className="text-sm text-muted-foreground pt-2">
                                                Seja o mais descritivo possível para obter o melhor resultado. Você pode colar o conteúdo ou extrair de uma URL.
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleGenerateWithAI}
                                        disabled={isGeneratingWithAI || isExtracting}
                                        size="lg"
                                        className="w-full mt-6 font-bold text-lg py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground hover:from-blue-600 hover:to-purple-700"
                                    >
                                        {isGeneratingWithAI ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Gerando...
                                        </>
                                        ) : (
                                        <>
                                            <Sparkles className="mr-2 h-5 w-5" />
                                            Gerar Página
                                        </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
                
                 <div className="flex-1 flex flex-col relative min-h-[600px] md:min-h-0">
                    {pageConfig ? (
                      <PreviewPanel pageConfig={pageConfig} viewMode={viewMode} setViewMode={setViewMode} />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-muted/40 h-full rounded-lg border">
                           <div className="text-center text-muted-foreground">
                                <Bot size={48} className="mx-auto mb-4" />
                                <h3 className="text-xl font-semibold">Aguardando sua ideia...</h3>
                                <p>Descreva a página que você quer criar para ver a mágica acontecer.</p>
                           </div>
                        </div>
                    )}
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

    