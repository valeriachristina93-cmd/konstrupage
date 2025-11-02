"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { PageConfig } from '@/lib/definitions';
import { generatePresellHtml } from '@/lib/html-generator';
import { Laptop, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PreviewPanelProps {
    pageConfig: PageConfig;
}

export function PreviewPanel({ pageConfig }: PreviewPanelProps) {
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const html = generatePresellHtml(pageConfig);
        if (iframeRef.current) {
            iframeRef.current.srcdoc = html;
        }
    }, [pageConfig]);

    return (
        <>
            <div className="absolute top-4 right-6 flex items-center space-x-2 bg-background/80 backdrop-blur-sm p-1 rounded-full shadow-md z-10">
                <Button onClick={() => setPreviewMode('desktop')} variant={previewMode === 'desktop' ? 'primary' : 'ghost'} size="icon" className="rounded-full">
                    <Laptop className="w-5 h-5" />
                </Button>
                <Button onClick={() => setPreviewMode('mobile')} variant={previewMode === 'mobile' ? 'primary' : 'ghost'} size="icon" className="rounded-full">
                    <Smartphone className="w-5 h-5" />
                </Button>
            </div>

            <div className={cn(
                "transition-all duration-300 ease-in-out bg-background dark:bg-black rounded-xl shadow-2xl overflow-hidden",
                previewMode === 'desktop' ? 'w-full h-full' : 'w-[375px] h-[812px] border-8 border-black dark:border-gray-800'
            )}>
                <iframe
                    ref={iframeRef}
                    title="Presell Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                />
            </div>
        </>
    );
}
