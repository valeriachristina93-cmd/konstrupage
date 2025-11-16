
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface AdBreakModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
}

const COUNTDOWN_SECONDS = 5;

const adSlots = [
    { slot: "4951935434", key: "teste-1" }, // TESTE 1
    { slot: "1783487248", key: "anuncio-2" }, // anuncio 2
    { slot: "4647596135", key: "bloco-2" }, // bloco 2
    { slot: "3013405679", key: "bloco-3" }, // bloco 3
    { slot: "7420334793", key: "bloco-4" }, // bloco 4
    { slot: "3255635177", key: "bloco-5" }, // bloco 5
];

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
            adSlots.forEach(ad => {
                try {
                    // @ts-ignore
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {
                    console.error(`AdSense error for slot ${ad.slot}:`, e);
                }
            });
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
            <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Aguarde um instante...</DialogTitle>
                    <DialogDescription>
                        Para manter a ferramenta gratuita, exibimos alguns anúncios rápidos. Agradecemos sua compreensão!
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 my-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                        {isAdLoading && (
                            <div className="col-span-full flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
                                <Loader2 className="animate-spin h-8 w-8" />
                                <span>Carregando anúncios...</span>
                            </div>
                        )}
                        {adSlots.map((ad, index) => (
                             <div key={ad.key} className="bg-muted min-h-[250px] flex items-center justify-center rounded-md">
                                <ins className="adsbygoogle"
                                     style={{ display: isAdLoading ? 'none' : 'block', width: '300px', height: '250px' }}
                                     data-ad-client="ca-pub-1234567890123456"
                                     data-ad-slot={ad.slot}></ins>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button 
                        onClick={handleContinue} 
                        disabled={countdown > 0}
                        className="w-full"
                        size="lg"
                    >
                        {countdown > 0 ? `Continuar em ${countdown}s` : 'Continuar e Gerar Página'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
