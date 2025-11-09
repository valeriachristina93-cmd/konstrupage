
"use client";

import React, { useState, useCallback, useTransition } from 'react';
import type { PageConfig } from '@/lib/definitions';
import { initialPageConfig } from '@/lib/constants';
import { SettingsPanel } from '@/components/editor/settings-panel';
import { PreviewPanel } from '@/components/editor/preview-panel';
import { GenerateCodeModal } from '@/components/editor/generate-code-modal';
import { useToast } from '@/hooks/use-toast';
import { EditorHeader } from '@/components/editor/editor-header';
import type { ViewMode } from '@/app/(protected)/editor/page';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Bot, ArrowLeft } from 'lucide-react';
import { generatePage } from './actions';
import Link from 'next/link';

export default function GeneratorPage() {
    const [pageConfig, setPageConfig] = useState<PageConfig | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
    const [description, setDescription] = useState('');
    const { toast } = useToast();
    const [viewMode, setViewMode] = useState<ViewMode>('desktop');

    const handleConfigChange = useCallback((keys: (string | number)[], value: any) => {
        setPageConfig(prev => {
            if (!prev) return null;
            const newConfig = JSON.parse(JSON.stringify(prev));
            let currentLevel: any = newConfig;
            for (let i = 0; i < keys.length - 1; i++) {
                if (currentLevel[keys[i]] === undefined) {
                    currentLevel[keys[i]] = {};
                }
                currentLevel = currentLevel[keys[i]];
            }
            currentLevel[keys[keys.length - 1]] = value;
            return newConfig;
        });
    }, []);

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
        if (!description.trim()) {
          toast({
            variant: "destructive",
            title: "Descrição necessária",
            description: "Por favor, descreva a página que você deseja criar.",
          });
          return;
        }
    
        setIsGeneratingWithAI(true);
        try {
          const result = await generatePage(description);
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
                        />
                    ) : (
                        <div className="p-4 flex flex-col h-full">
                            <h2 className="text-lg font-semibold mb-4">Gerar Página com IA</h2>
                            <Card className="shadow-lg flex-1 flex flex-col">
                                <CardContent className="p-6 flex-1 flex flex-col">
                                    <div className="space-y-4 flex-1 flex flex-col">
                                        <Label htmlFor="description" className="text-lg font-medium">
                                        Descreva a página que você precisa
                                        </Label>
                                        <Textarea
                                        id="description"
                                        placeholder="Ex: Uma página de presell para um produto de emagrecimento chamado 'Slim Caps'. Use uma imagem de uma pessoa feliz e saudável. O pop-up deve ser de verificação de idade."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="min-h-[120px] text-base flex-1"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                        Seja o mais descritivo possível para obter o melhor resultado. Mencione o produto, o público-alvo e os elementos que você deseja.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleGenerateWithAI}
                                        disabled={isGeneratingWithAI}
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

    
