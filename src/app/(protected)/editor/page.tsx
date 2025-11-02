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
    const [isPending, startTransition] = useTransition();
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
        setGeneratedHtml(generatePresellHtml(pageConfig));
        setIsModalOpen(true);
    };

    const handleSuggestLayout = () => {
        startTransition(async () => {
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
        <div className="flex flex-col md:flex-row h-screen-minus-header bg-secondary text-foreground">
            <GenerateCodeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                htmlContent={generatedHtml}
            />

            <div className="w-full md:w-1/3 md:max-w-md h-full overflow-y-auto bg-background shadow-lg flex flex-col">
                <EditorHeader onGenerate={handleGenerate} affiliateLink={pageConfig.affiliateLink} />
                <SettingsPanel
                    pageConfig={pageConfig}
                    onConfigChange={handleConfigChange}
                    onSuggestLayout={handleSuggestLayout}
                    isSuggestingLayout={isPending}
                />
            </div>

            <div className="w-full md:w-2/3 flex-1 flex flex-col items-center justify-center p-2 sm:p-6 relative">
                <PreviewPanel pageConfig={pageConfig} />
            </div>
        </div>
    );
}

// Add a helper style to layout to calculate height correctly
const css = `
  .h-screen-minus-header {
    height: calc(100vh - 61px);
  }
`;
const style = typeof document !== 'undefined' ? document.createElement('style') : null;
if (style) {
  style.textContent = css;
  document.head.append(style);
}
