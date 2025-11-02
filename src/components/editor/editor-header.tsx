"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditorHeaderProps {
    onGenerate: () => void;
    affiliateLink: string;
}

export function EditorHeader({ onGenerate, affiliateLink }: EditorHeaderProps) {
    return (
        <div className="p-4 border-b bg-background z-10 space-y-4">
             <Link href="/dashboard" className="flex items-center gap-2 text-sm text-primary hover:underline">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Dashboard
            </Link>
            <Button 
                onClick={onGenerate} 
                disabled={!affiliateLink}
                className="w-full font-bold text-lg py-6 bg-gradient-to-r from-primary to-blue-500 text-primary-foreground hover:opacity-90 transition-transform"
            >
                Gerar Página
            </Button>
            {!affiliateLink && <p className="text-xs text-destructive text-center">Insira um link de afiliado para gerar a página.</p>}
        </div>
    );
}
