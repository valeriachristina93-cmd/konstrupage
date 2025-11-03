
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generatePage } from './actions';
import { useToast } from '@/hooks/use-toast';

export default function GeneratorPage() {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Descrição necessária",
        description: "Por favor, descreva a página que você deseja criar.",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      const result = await generatePage(description);
      setGeneratedContent(result);
       toast({
        title: "Página Gerada com Sucesso!",
        description: "A estrutura da sua página foi criada pela IA.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar a página",
        description: "Houve um problema com a IA. Tente novamente mais tarde.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex h-16 items-center border-b bg-background px-4 md:px-6 sticky top-0 z-40 gap-4">
        <Link href="/dashboard" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          Gerador de Páginas com IA
        </h1>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-2xl space-y-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Label htmlFor="description" className="text-lg font-medium">
                  Descreva a página que você precisa
                </Label>
                <Textarea
                  id="description"
                  placeholder="Ex: Uma página de presell para um produto de emagrecimento chamado 'Slim Caps'. Use uma imagem de uma pessoa feliz e saudável. O pop-up deve ser de verificação de idade."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] text-base"
                  rows={5}
                />
                <p className="text-sm text-muted-foreground">
                  Seja o mais descritivo possível para obter o melhor resultado. Mencione o produto, o público-alvo e os elementos que você deseja.
                </p>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                size="lg"
                className="w-full mt-6 font-bold text-lg py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground hover:from-blue-600 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Gerar Página
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          {generatedContent && (
            <Card className="shadow-lg">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Conteúdo Gerado (JSON)</h3>
                    <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                        <code>{JSON.stringify(generatedContent, null, 2)}</code>
                    </pre>
                </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  );
}
