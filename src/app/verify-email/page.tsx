
'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { sendEmailVerification } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MailCheck, Send, LogIn } from 'lucide-react';
import Image from 'next/image';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const [isResending, setIsResending] = useState(false);
  const email = searchParams.get('email');

  const handleResendVerification = async () => {
    const currentUser = user || auth.currentUser;
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Usuário não encontrado',
        description: 'Faça login novamente para reenviar o e-mail.',
      });
      return;
    }

    setIsResending(true);
    try {
      await sendEmailVerification(currentUser);
      toast({
        title: 'E-mail Reenviado!',
        description: 'Um novo link de verificação foi enviado para o seu e-mail.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falha ao Reenviar',
        description: 'Não foi possível reenviar o e-mail. Tente novamente mais tarde.',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <div className="w-full max-w-lg p-4">
        <div className="flex justify-center mb-8">
            <Image src="https://i.imgur.com/ihAZlua.png" alt="Konstrupages Logo" width={64} height={64} />
        </div>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                <MailCheck className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
                Verifique seu E-mail
            </CardTitle>
            <CardDescription>
                Enviamos um link de confirmação para <span className="font-semibold text-foreground">{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>
                Por favor, clique no link em seu e-mail para ativar sua conta. Lembre-se de verificar sua caixa de spam ou lixo eletrônico.
            </p>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full"
                variant="secondary"
            >
                {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Reenviar E-mail
            </Button>
            <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Voltar para o Login
                </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}


export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <VerifyEmailContent />
        </Suspense>
    )
}

    