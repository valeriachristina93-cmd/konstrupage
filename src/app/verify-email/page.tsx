
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { sendEmailVerification } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MailCheck, Send, LogIn } from 'lucide-react';
import Image from 'next/image';


export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUser();
    const auth = useAuth();
    const { toast } = useToast();

    const [isResending, setIsResending] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        // We get the email from searchParams on the client side
        const emailFromParams = searchParams.get('email');
        if (emailFromParams) {
            setEmail(emailFromParams);
        }
    }, [searchParams]);

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
        <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <Image src="https://i.imgur.com/ihAZlua.png" alt="Konstrupages Logo" width={64} height={64} />
                </div>
                <Card className="shadow-lg border-primary/20">
                    <CardHeader className="text-center items-center pt-8">
                        <MailCheck className="h-20 w-20 text-primary mb-4" />
                        <CardTitle className="text-3xl font-bold">
                            Verifique seu E-mail
                        </CardTitle>
                        <CardDescription className="text-base pt-2">
                            Enviamos um link de confirmação para <br/> <span className="font-semibold text-foreground">{email}</span>.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground px-8">
                        <p>
                            Por favor, clique no link em seu e-mail para ativar sua conta. Lembre-se de verificar sua caixa de spam ou lixo eletrônico.
                        </p>
                    </CardContent>
                    <CardFooter className="flex-col gap-3 p-6 bg-muted/50">
                        <Button
                            onClick={handleResendVerification}
                            disabled={isResending}
                            className="w-full h-12 text-base bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground hover:from-blue-600 hover:to-purple-700 transition-all"
                        >
                            {isResending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                            Reenviar E-mail
                        </Button>
                        <Link href="/login" className="w-full">
                            <Button variant="ghost" className="w-full h-11 text-base">
                                <LogIn className="mr-2 h-5 w-5" />
                                Voltar para o Login
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

