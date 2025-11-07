
"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { PageConfig } from '@/lib/definitions';
import { generatePresellHtml } from '@/lib/html-generator';
import { Laptop, Smartphone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import type { ViewMode } from '@/app/(protected)/editor/page';

interface PreviewPanelProps {
    pageConfig: PageConfig;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
}

export function PreviewPanel({ pageConfig, viewMode, setViewMode }: PreviewPanelProps) {
    const [isRendering, setIsRendering] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const debouncedPageConfig = useDebounce(pageConfig, 500);

    useEffect(() => {
        setIsRendering(true);
        
        const iframe = iframeRef.current;
        if (!iframe) return;

        // Start fade-out transition
        iframe.style.opacity = '0';

        const handleLoad = () => {
            // Start fade-in transition
            iframe.style.opacity = '1';
            setIsRendering(false);
        };
        
        const timer = setTimeout(() => {
            const html = generatePresellHtml(debouncedPageConfig);
            iframe.srcdoc = html;
            iframe.addEventListener('load', handleLoad, { once: true });
        }, 250); // Wait for fade-out to be noticeable

        return () => {
            clearTimeout(timer);
            iframe.removeEventListener('load', handleLoad);
        };
    }, [debouncedPageConfig]);

    return (
        <div className="flex-1 flex flex-col items-center justify-center relative bg-muted/40 h-full rounded-lg border">
            <div className="absolute top-4 right-6 flex items-center space-x-1 bg-card/80 backdrop-blur-sm p-1 rounded-lg shadow-md z-10">
                <Button onClick={() => setViewMode('desktop')} variant={viewMode === 'desktop' ? 'default' : 'ghost'} size="icon" className="rounded-md">
                    <Laptop className="w-5 h-5" />
                </Button>
                <Button onClick={() => setViewMode('mobile')} variant={viewMode === 'mobile' ? 'default' : 'ghost'} size="icon" className="rounded-md">
                    <Smartphone className="w-5 h-5" />
                </Button>
            </div>
            
            <div className="relative w-full h-full flex items-center justify-center">
                 {isRendering && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-20 rounded-lg transition-opacity duration-300">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                <div className={cn(
                    "transition-all duration-300 ease-in-out bg-background dark:bg-black overflow-hidden",
                    viewMode === 'desktop' ? 'w-full h-full rounded-lg' : 'w-[375px] h-[740px] rounded-xl shadow-2xl border-8 border-black dark:border-gray-800'
                )}>
                    <iframe
                        ref={iframeRef}
                        title="Presell Preview"
                        className="w-full h-full border-0 transition-opacity duration-300 ease-in-out"
                        sandbox="allow-scripts allow-same-origin"
                        style={{ opacity: 0 }} // Start with iframe invisible
                    />
                </div>
            </div>
        </div>
    );
}
