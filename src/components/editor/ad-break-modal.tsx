
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AdBreakModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
}

const COUNTDOWN_SECONDS = 15;

export function AdBreakModal({ isOpen, onClose, onContinue }: AdBreakModalProps) {
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
    const [isAdLoading, setIsAdLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) {
            setCountdown(COUNTDOWN_SECONDS);
            setIsAdLoading(true);
            return;
        }

        const timer = setInterval(() => {
            setCountdown(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        // Simulate ad loading time
        const adLoadTimer = setTimeout(() => {
            setIsAdLoading(false);
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("AdSense error:", e);
            }
        }, 1500);

        return () => {
            clearInterval(timer);
            clearTimeout(adLoadTimer);
        };
    }, [isOpen]);

    const handleContinue = () => {
        onContinue();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md w-full" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Aguarde um instante...</DialogTitle>
                    <DialogDescription>
                        Para manter a ferramenta gratuita, exibimos um anúncio rápido antes de gerar sua página. Agradecemos sua compreensão!
                    </DialogDescription>
                </DialogHeader>

                <div className="my-4 flex items-center justify-center bg-muted min-h-[250px] rounded-md">
                     {isAdLoading && (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader2 className="animate-spin h-8 w-8" />
                            <span>Carregando anúncio...</span>
                        </div>
                    )}
                    <ins className="adsbygoogle"
                         style={{ display: isAdLoading ? 'none' : 'block', width: '300px', height: '250px' }}
                         data-ad-client="ca-pub-1234567890123456"
                         data-ad-slot="3255635177"></ins>
                </div>

                <DialogFooter>
                    <Button 
                        onClick={handleContinue} 
                        disabled={countdown > 0}
                        className="w-full"
                    >
                        {countdown > 0 ? `Continuar em ${countdown}s` : 'Continuar e Gerar Página'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
