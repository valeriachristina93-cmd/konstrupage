
"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { PageConfig } from '@/lib/definitions';
import { generatePresellHtml } from '@/lib/html-generator';
import { Laptop, Smartphone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

interface PreviewPanelProps {
    pageConfig: PageConfig;
}

export function PreviewPanel({ pageConfig }: PreviewPanelProps) {
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [isRendering, setIsRendering] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const debouncedPageConfig = useDebounce(pageConfig, 800);

    useEffect(() => {
        setIsRendering(true);
        const html = generatePresellHtml(debouncedPageConfig);
        if (iframeRef.current) {
            iframeRef.current.srcdoc = html;
            const handleLoad = () => setIsRendering(false);
            iframeRef.current.addEventListener('load', handleLoad);
            return () => iframeRef.current?.removeEventListener('load', handleLoad);
        }
    }, [debouncedPageConfig]);

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-0 relative bg-background/20 rounded-lg border">
            <div className="absolute top-4 right-6 flex items-center space-x-2 bg-background/80 backdrop-blur-sm p-1 rounded-full shadow-md z-10">
                <Button onClick={() => setPreviewMode('desktop')} variant={previewMode === 'desktop' ? 'primary' : 'ghost'} size="icon" className="rounded-full">
                    <Laptop className="w-5 h-5" />
                </Button>
                <Button onClick={() => setPreviewMode('mobile')} variant={previewMode === 'mobile' ? 'primary' : 'ghost'} size="icon" className="rounded-full">
                    <Smartphone className="w-5 h-5" />
                </Button>
            </div>
            
            <div className="relative w-full h-full flex items-center justify-center">
                 {isRendering && (
                    <div className="absolute inset-0 bg-background/30 backdrop-blur-sm flex items-center justify-center z-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                <div className={cn(
                    "transition-all duration-300 ease-in-out bg-background dark:bg-black rounded-xl shadow-2xl overflow-hidden",
                    previewMode === 'desktop' ? 'w-full aspect-video' : 'w-[375px] h-[740px] border-8 border-black dark:border-gray-800'
                )}>
                    <iframe
                        ref={iframeRef}
                        title="Presell Preview"
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin"
                    />
                </div>
            </div>
        </div>
    );
}
