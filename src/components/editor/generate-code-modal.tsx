
"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, Check, FileArchive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';
import type { PageConfig } from '@/lib/definitions';
import { generatePresellHtml, generatePostPageHtml, generatePrivacyPolicyHtml, generateTermsOfUseHtml } from '@/lib/html-generator';

interface GenerateCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    pageConfig: PageConfig;
}

export function GenerateCodeModal({ isOpen, onClose, pageConfig }: GenerateCodeModalProps) {
    const [hasCopied, setHasCopied] = useState(false);
    const { toast } = useToast();

    const presellHtml = generatePresellHtml(pageConfig);
    
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

    const downloadFilesAsZip = () => {
        const zip = new JSZip();

        // 1. Página principal
        zip.file('presell-page.html', presellHtml);

        // 2. Páginas de Post (se existirem) - Geradas como arquivos separados
        if (pageConfig.postPages && pageConfig.postPages.length > 0) {
            pageConfig.postPages.forEach((post, index) => {
                if (post.active) {
                    const postHtml = generatePostPageHtml(pageConfig, post);
                    zip.file(`post-${index + 1}.html`, postHtml);
                }
            });
        }
        
        // 3. Páginas legais (se auto-geradas)
        if (pageConfig.footer.active && pageConfig.footer.autoGenerate) {
            const privacyHtml = generatePrivacyPolicyHtml(pageConfig);
            const termsHtml = generateTermsOfUseHtml(config);
            zip.file('privacy-policy.html', `<html><head><title>Política de Privacidade</title><link rel="stylesheet" href="style.css"></head><body>${privacyHtml}</body></html>`);
            zip.file('terms-of-use.html', `<html><head><title>Termos de Uso</title><link rel="stylesheet" href="style.css"></head><body>${termsHtml}</body></html>`);
        }

        zip.generateAsync({ type: 'blob' }).then(content => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'presell-package.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: "Download do ZIP iniciado", description: "O pacote com todas as páginas está sendo baixado." });
        });
    };

    const downloadHtml = () => {
        const blob = new Blob([presellHtml], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'presell-page.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Download iniciado", description: "O arquivo presell-page.html está sendo baixado." });
    };

    const shouldGenerateZip = pageConfig.postPages.length > 0 || (pageConfig.footer.active && pageConfig.footer.autoGenerate);


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
                    
                    <Button 
                        onClick={downloadHtml} 
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        Baixar HTML
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
