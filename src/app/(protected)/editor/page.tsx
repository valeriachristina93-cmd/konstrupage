
"use client";

import React, { useState, useCallback, useTransition } from 'react';
import type { PageConfig } from '@/lib/definitions';
import { initialPageConfig } from '@/lib/constants';
import { SettingsPanel } from '@/components/editor/settings-panel';
import { PreviewPanel } from '@/components/editor/preview-panel';
import { GenerateCodeModal } from '@/components/editor/generate-code-modal';
import { getSuggestedLayout } from './actions';
import { useToast } from '@/hooks/use-toast';
import { EditorHeader } from '@/components/editor/editor-header';

export type ViewMode = 'desktop' | 'mobile';

export default function EditorPage() {
    const [pageConfig, setPageConfig] = useState<PageConfig>(initialPageConfig);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAISuggesting, startAITransition] = useTransition();
    const { toast } = useToast();
    const [viewMode, setViewMode] = useState<ViewMode>('desktop');

    const handleConfigChange = useCallback((keys: (string | number)[], value: any) => {
        setPageConfig(prev => {
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
        setTimeout(() => {
            setIsModalOpen(true);
            setIsGenerating(false);
        }, 500);
    };

    return (
        <div className="flex flex-col h-screen bg-muted/30 text-foreground">
            <EditorHeader 
                onGenerate={handleGenerate} 
                isGenerating={isGenerating}
                affiliateLink={pageConfig.affiliateLink}
            />
            <main className="flex-1 flex flex-col md:flex-row gap-8 justify-center overflow-y-auto p-4 md:p-8">
                 <div className="w-full md:min-w-[400px] lg:min-w-[448px] md:max-w-[448px] flex flex-col bg-card shadow-sm border rounded-lg">
                    <SettingsPanel
                        pageConfig={pageConfig}
                        onConfigChange={handleConfigChange}
                        onImageUpload={handleImageUpload}
                        setViewMode={setViewMode}
                    />
                </div>
                
                 <div className="flex-1 flex flex-col relative min-h-[600px] md:min-h-0">
                    <PreviewPanel pageConfig={pageConfig} viewMode={viewMode} setViewMode={setViewMode} />
                </div>
            </main>
            {isModalOpen && (
                <GenerateCodeModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    pageConfig={pageConfig}
                />
            )}
        </div>
    );
}
