
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Tv } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';

interface AdBreakModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
}

const COUNTDOWN_SECONDS = 15;

const adSlots = [
    { slot: "4951935434", key: "teste-1" },
    { slot: "1783487248", key: "anuncio-2" },
    { slot: "4647596135", key: "bloco-2" },
    { slot: "3013405679", key: "bloco-3" },
    { slot: "7420334793", key: "bloco-4" },
    { slot: "3255635177", key: "bloco-5" },
];

export function AdBreakModal({ isOpen, onClose, onContinue }: AdBreakModalProps) {
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
    const [progress, setProgress] = useState(0);
    const [isAdLoading, setIsAdLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) {
            setCountdown(COUNTDOWN_SECONDS);
            setProgress(0);
            setIsAdLoading(true);
            return;
        }

        const countdownTimer = setInterval(() => {
            setCountdown(prev => {
                const newCountdown = prev > 0 ? prev - 1 : 0;
                const newProgress = ((COUNTDOWN_SECONDS - newCountdown) / COUNTDOWN_SECONDS) * 100;
                setProgress(newProgress);
                return newCountdown;
            });
        }, 1000);

        // Simulate ad loading time
        const adLoadTimer = setTimeout(() => {
            setIsAdLoading(false);
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("AdSense push error:", e);
            }
        }, 1500);

        return () => {
            clearInterval(countdownTimer);
            clearTimeout(adLoadTimer);
        };
    }, [isOpen]);

    const handleContinue = () => {
        onContinue();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader className="p-6 pb-4">
                    <div className='flex items-center gap-3'>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                             <Tv className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Um Rápido Intervalo</DialogTitle>
                            <DialogDescription>
                                Para manter a ferramenta gratuita, exibimos anúncios rápidos. Agradecemos sua compreensão!
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 my-0 px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {adSlots.map((ad) => (
                             <div key={ad.key} className="bg-muted min-h-[250px] flex items-center justify-center rounded-md">
                                {isAdLoading ? (
                                    <Skeleton className="w-[300px] h-[250px]" />
                                ) : (
                                    <ins className="adsbygoogle"
                                         style={{ display: 'block', width: '300px', height: '250px' }}
                                         data-ad-client="ca-pub-1234567890123456"
                                         data-ad-slot={ad.slot}></ins>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <DialogFooter className="p-6 pt-4 border-t">
                    <div className='w-full flex flex-col gap-2'>
                        <Button 
                            onClick={handleContinue} 
                            disabled={countdown > 0}
                            className="w-full"
                            size="lg"
                        >
                            {countdown > 0 ? `Aguarde...` : 'Continuar e Gerar Página'}
                        </Button>
                         <Progress value={progress} className="h-2" />
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
