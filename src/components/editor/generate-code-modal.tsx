"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GenerateCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    htmlContent: string;
}

export function GenerateCodeModal({ isOpen, onClose, htmlContent }: GenerateCodeModalProps) {
    const [hasCopied, setHasCopied] = useState(false);
    const { toast } = useToast();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(htmlContent).then(() => {
            setHasCopied(true);
            toast({ title: "Copiado!", description: "O código HTML foi copiado para a área de transferência." });
            setTimeout(() => setHasCopied(false), 2000);
        }, (err) => {
            toast({ variant: "destructive", title: "Falha ao copiar", description: "Não foi possível copiar o código." });
            console.error('Could not copy text: ', err);
        });
    };

    const downloadHtml = () => {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'presell-page.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Download iniciado", description: "O arquivo presell-page.html está sendo baixado." });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl w-full h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle>Código da Página Gerada</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-grow px-6">
                    <pre className="bg-muted p-4 rounded-md text-sm text-foreground whitespace-pre-wrap break-all">
                        <code>{htmlContent}</code>
                    </pre>
                </ScrollArea>
                <DialogFooter className="p-6 pt-4 border-t flex-col sm:flex-row gap-2">
                    <Button onClick={copyToClipboard} variant="secondary" className="w-full sm:w-auto">
                        {hasCopied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                        {hasCopied ? 'Copiado!' : 'Copiar Código'}
                    </Button>
                    <Button onClick={downloadHtml} className="w-full sm:w-auto">
                        <Download className="w-5 h-5 mr-2" />
                        Baixar HTML
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
