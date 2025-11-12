
"use client";

import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, PlayCircle } from 'lucide-react';

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
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

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

    // TODO: Replace with actual ad slot IDs from AdSense account
    const adSlotIds = ['1234567890', '0987654321', '1122334455'];
    
    if (!adsenseClient) {
        // If adsense is not configured, we should not block the user.
        if (isOpen) {
          onClose();
        }
        return null;
    }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full h-auto flex flex-col p-8" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <PlayCircle className="text-primary"/>
            Uma pausa para nossos patrocinadores
          </DialogTitle>
          <DialogDescription>
            Sua ferramenta continua gratuita graças a eles. Por favor, considere visitar um anúncio que lhe interesse.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
            {adSlotIds.map(id => (
                 <div key={id} className="aspect-square">
                    <AdSlot client={adsenseClient} slotId={id} />
                 </div>
            ))}
        </div>
        
        <div className="flex justify-center">
            <Button onClick={onClose} size="lg">
                Continuar usando a ferramenta
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
