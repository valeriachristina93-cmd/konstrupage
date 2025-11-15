
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, PlayCircle, X } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdSlot = ({ slotId, client, style }: { slotId: string; client: string; style?: React.CSSProperties }) => {
  React.useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [slotId, client]);

  return (
    <div className="w-full h-full bg-muted/50 rounded-md flex items-center justify-center border border-dashed">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%', ...style }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};


export function AdBreakModal({ isOpen, onClose }: AdBreakModalProps) {
    const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    const [isClosable, setIsClosable] = React.useState(false);
    const [countdown, setCountdown] = React.useState(15);
    const countdownRef = React.useRef<NodeJS.Timeout | null>(null);

    const adSlotIds = ['7995115463', '4647596135', '1783487248', '3013405679', '7420334793', '3255635177'];
    
    React.useEffect(() => {
        if (isOpen) {
            setIsClosable(false);
            setCountdown(15);
            
            countdownRef.current = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownRef.current!);
                        setIsClosable(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } else {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
        }

        return () => {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
        };
    }, [isOpen]);

    if (!adsenseClient) {
        if (isOpen) {
          onClose();
        }
        return null;
    }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && isClosable && onClose()}>
      <DialogContent className="max-w-4xl w-full flex flex-col p-6" onPointerDownOutside={(e) => { if(!isClosable) e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <PlayCircle className="text-primary"/>
            Um momento para quem mantém esta ferramenta gratuita
          </DialogTitle>
          <DialogDescription>
            A exibição de anúncios é o que nos permite continuar desenvolvendo e oferecendo a Konstrupages sem nenhum custo. Sua atenção, mesmo que por alguns segundos, faz toda a diferença para nós.
          </DialogDescription>
        </DialogHeader>

        {isClosable && (
          <DialogClose asChild>
            <button
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                onClick={onClose}
                aria-label="Close"
            >
                <X className="h-4 w-4" />
            </button>
          </DialogClose>
        )}

        <div className="flex-grow grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
            {adSlotIds.map(id => (
                 <div key={id} className="w-full h-auto min-h-[250px] max-h-[250px]">
                    <AdSlot client={adsenseClient} slotId={id} />
                 </div>
            ))}
        </div>
        
        <div className="flex justify-center mt-2">
            <Button onClick={onClose} size="lg" disabled={!isClosable}>
                {isClosable ? "Continuar usando a ferramenta" : `Aguarde ${countdown} segundos...`}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
