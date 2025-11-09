"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, Check, FileArchive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';
import type { PageConfig } from '@/lib/definitions';
import { generatePresellHtml, generatePostPageHtml } from '@/lib/html-generator';

interface GenerateCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    pageConfig: PageConfig;
}

export function GenerateCodeModal({ isOpen, onClose, pageConfig }: GenerateCodeModalProps) {
    const [hasCopied, setHasCopied] = useState(false);
    const { toast } = useToast();

    const presellHtml = generatePresellHtml(pageConfig);
    const postPageHtml = pageConfig.postPage.active ? generatePostPageHtml(pageConfig) : null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(presellHtml).then(() => {
            setHasCopied(true);
            toast({ title: "Copiado!", description: "O código HTML da página principal foi copiado." });
            setTimeout(() => setHasCopied(false), 2000);
        }, (err) => {
            toast({ variant: "destructive", title: "Falha ao copiar", description: "Não foi possível copiar o código." });
            console.error('Could not copy text: ', err);
        });
    };

    const downloadFile = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadHtml = () => {
        downloadFile(presellHtml, 'presell-page.html');
        toast({ title: "Download iniciado", description: "O arquivo presell-page.html está sendo baixado." });
    };

    const downloadZip = async () => {
        if (!postPageHtml) return;

        const zip = new JSZip();
        zip.file("presell-page.html", presellHtml);
        zip.file("post-page.html", postPageHtml);

        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'presell-project.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Download iniciado", description: "O arquivo presell-project.zip está sendo baixado." });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl w-full h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle>Código da Página Gerada</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-grow px-6">
                    <pre className="bg-muted p-4 rounded-md text-sm text-foreground whitespace-pre-wrap break-all">
                        <code>{presellHtml}</code>
                    </pre>
                </ScrollArea>
                <DialogFooter className="p-6 pt-4 border-t flex-col sm:flex-row gap-2">
                    <Button onClick={copyToClipboard} variant="secondary" className="w-full sm:w-auto">
                        {hasCopied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                        {hasCopied ? 'Copiado!' : 'Copiar Código'}
                    </Button>
                    
                    {postPageHtml ? (
                        <Button 
                            onClick={downloadZip} 
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground hover:from-blue-600 hover:to-purple-700 transition-all"
                        >
                            <FileArchive className="w-5 h-5 mr-2" />
                            Baixar .zip (2 páginas)
                        </Button>
                    ) : (
                         <Button 
                            onClick={downloadHtml} 
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground hover:from-blue-600 hover:to-purple-700 transition-all"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Baixar HTML
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
