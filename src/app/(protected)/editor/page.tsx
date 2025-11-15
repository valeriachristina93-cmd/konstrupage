
"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { PageConfig, PostPageConfig } from '@/lib/definitions';
import { getInitialPageConfig } from '@/lib/constants';
import { SettingsPanel } from '@/components/editor/settings-panel';
import { PreviewPanel } from '@/components/editor/preview-panel';
import { GenerateCodeModal } from '@/components/editor/generate-code-modal';
import { AdBreakModal } from '@/components/ad-break-modal';
import { useToast } from '@/hooks/use-toast';
import { EditorHeader } from '@/components/editor/editor-header';
import { useLanguage } from '@/context/language-context';
import { useUser } from '@/firebase';

export type ViewMode = 'desktop' | 'mobile';

const AD_BREAK_INTERVAL = 8 * 60 * 1000; // 8 minutes
const ADMIN_EMAIL = 'rogerioramos802@gmail.com';

export default function EditorPage() {
    const { t } = useLanguage();
    const { user } = useUser();
    const [pageConfig, setPageConfig] = useState<PageConfig>(getInitialPageConfig(t));
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isAdBreakModalOpen, setIsAdBreakModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();
    const [viewMode, setViewMode] = useState<ViewMode>('desktop');
    const [previewingPostIndex, setPreviewingPostIndex] = useState<number | null>(null);
    const adBreakTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [isAdTriggeredByGeneration, setIsAdTriggeredByGeneration] = useState(false);

    const isUserAdmin = user?.email === ADMIN_EMAIL;

    const resetAdBreakTimer = useCallback(() => {
        if (isUserAdmin) return;
        if (adBreakTimerRef.current) {
            clearTimeout(adBreakTimerRef.current);
        }
        adBreakTimerRef.current = setTimeout(() => {
            setIsAdTriggeredByGeneration(false);
            setIsAdBreakModalOpen(true);
        }, AD_BREAK_INTERVAL);
    }, [isUserAdmin]);

    useEffect(() => {
        resetAdBreakTimer();
        return () => {
            if (adBreakTimerRef.current) {
                clearTimeout(adBreakTimerRef.current);
            }
        };
    }, [resetAdBreakTimer]);

    useEffect(() => {
        setPageConfig(getInitialPageConfig(t));
    }, [t]);

    const handleConfigChange = useCallback((keys: (string | number)[], value: any) => {
        setPageConfig(prev => {
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
        resetAdBreakTimer();
    }, [resetAdBreakTimer]);

     const addPostPage = () => {
        setPageConfig(prev => {
            const newConfig = JSON.parse(JSON.stringify(prev));
            const newPost: PostPageConfig = {
                active: true,
                productName: `${t('new_post')} ${newConfig.postPages.length + 1}`,
                content: t('write_your_article_here'),
                imageUrl: 'https://picsum.photos/seed/post1/800/400'
            };
            if (!newConfig.postPages) {
                newConfig.postPages = [];
            }
            newConfig.postPages.push(newPost);
            return newConfig;
        });
        resetAdBreakTimer();
    };

    const removePostPage = (index: number) => {
        setPageConfig(prev => {
            const newConfig = JSON.parse(JSON.stringify(prev));
            newConfig.postPages.splice(index, 1);
            return newConfig;
        });
        resetAdBreakTimer();
    };
    
    const handlePreviewPost = (index: number | null) => {
        if (previewingPostIndex === index) {
            setPreviewingPostIndex(null);
        } else {
            setPreviewingPostIndex(index);
        }
        resetAdBreakTimer();
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

    const continueWithGeneration = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerateModalOpen(true);
            setIsGenerating(false);
        }, 500);
    };

    const handleGenerate = () => {
        if (!pageConfig.affiliateLink) {
             toast({
                variant: "destructive",
                title: t('affiliate_link_required_title'),
                description: t('affiliate_link_required_desc'),
            });
            return;
        }

        if (isUserAdmin) {
            continueWithGeneration();
            return;
        }
        
        setIsAdTriggeredByGeneration(true);
        setIsAdBreakModalOpen(true);
    };

    const handleAdClose = () => {
        setIsAdBreakModalOpen(false);
        resetAdBreakTimer();
        if (isAdTriggeredByGeneration) {
            continueWithGeneration();
        }
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
                        addPostPage={addPostPage}
                        removePostPage={removePostPage}
                        onPreviewPost={handlePreviewPost}
                    />
                </div>
                
                 <div className="flex-1 flex flex-col relative min-h-[600px] md:min-h-0">
                    <PreviewPanel 
                        pageConfig={pageConfig} 
                        viewMode={viewMode} 
                        setViewMode={setViewMode}
                        previewingPostIndex={previewingPostIndex}
                    />
                </div>
            </main>
            {isGenerateModalOpen && (
                <GenerateCodeModal
                    isOpen={isGenerateModalOpen}
                    onClose={() => setIsGenerateModalOpen(false)}
                    pageConfig={pageConfig}
                />
            )}
            {!isUserAdmin && (
                <AdBreakModal 
                    isOpen={isAdBreakModalOpen}
                    onClose={handleAdClose}
                />
            )}
        </div>
    );
}
