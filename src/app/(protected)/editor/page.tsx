
"use client";

import React, { useState, useCallback, useTransition } from 'react';
import type { PageConfig } from '@/lib/definitions';
import { initialPageConfig } from '@/lib/constants';
import { SettingsPanel } from '@/components/editor/settings-panel';
import { PreviewPanel } from '@/components/editor/preview-panel';
import { GenerateCodeModal } from '@/components/editor/generate-code-modal';
import { generatePresellHtml } from '@/lib/html-generator';
import { getSuggestedLayout } from './actions';
import { useToast } from '@/hooks/use-toast';
import { EditorHeader } from '@/components/editor/editor-header';

export default function EditorPage() {
    const [pageConfig, setPageConfig] = useState<PageConfig>(initialPageConfig);
    const [generatedHtml, setGeneratedHtml] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAISuggesting, startAITransition] = useTransition();
    const { toast } = useToast();

    const handleConfigChange = useCallback((keys: string[], value: any) => {
        setPageConfig(prev => {
            const newConfig = JSON.parse(JSON.stringify(prev));
            let currentLevel: any = newConfig;
            for (let i = 0; i < keys.length - 1; i++) {
                currentLevel = currentLevel[keys[i]];
            }
            currentLevel[keys[keys.length - 1]] = value;
            return newConfig;
        });
    }, []);

    const handleGenerate = () => {
        if (!pageConfig.affiliateLink) {
             toast({
                variant: "destructive",
                title: "Link de Afiliado Obrigatório",
                description: "Por favor, insira um link de afiliado para gerar a página.",
            });
            return;
        }
        setIsGenerating(true);
        // Simulate generation time
        setTimeout(() => {
            setGeneratedHtml(generatePresellHtml(pageConfig));
            setIsModalOpen(true);
            setIsGenerating(false);
        }, 500);
    };

    const handleSuggestLayout = () => {
        startAITransition(async () => {
            try {
                const suggestion = await getSuggestedLayout({
                    desktopImage: pageConfig.desktopImage,
                    mobileImage: pageConfig.mobileImage,
                    imageHeightDesktop: pageConfig.imageHeightDesktop,
                    imageHeightMobile: pageConfig.imageHeightMobile,
                    overlayActive: pageConfig.overlay.active,
                });
                if(suggestion){
                    handleConfigChange(['imageHeightDesktop'], suggestion.suggestedDesktopHeight);
                    handleConfigChange(['imageHeightMobile'], suggestion.suggestedMobileHeight);
                    toast({
                        title: "Layout Otimizado!",
                        description: `Alturas da imagem ajustadas para ${suggestion.suggestedDesktopHeight}px (desktop) e ${suggestion.suggestedMobileHeight}px (mobile).`,
                    });
                }
            } catch (error) {
                console.error("Failed to get layout suggestion:", error);
                toast({
                    variant: "destructive",
                    title: "Erro na Sugestão",
                    description: "Não foi possível obter uma sugestão de layout da IA.",
                });
            }
        });
    };

    return (
        <div className="flex flex-col h-screen bg-secondary text-foreground">
            <EditorHeader 
                onGenerate={handleGenerate} 
                isGenerating={isGenerating}
                affiliateLink={pageConfig.affiliateLink}
            />
            <main className="flex-1 flex overflow-hidden">
                <GenerateCodeModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    htmlContent={generatedHtml}
                />
                
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    <div className="w-full md:min-w-[400px] lg:min-w-[448px] md:max-w-[448px] flex flex-col">
                        <SettingsPanel
                            pageConfig={pageConfig}
                            onConfigChange={handleConfigChange}
                            onSuggestLayout={handleSuggestLayout}
                            isSuggestingLayout={isAISuggesting}
                        />
                    </div>
                    
                    <div className="flex-1 flex flex-col relative p-4 md:p-6">
                       <PreviewPanel pageConfig={pageConfig} />
                    </div>
                </div>
            </main>
        </div>
    );
}
