
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  phone: z.string().regex(/^\d+$/, { message: 'O telefone deve conter apenas números.' }).min(10, { message: 'O telefone deve ter pelo menos 10 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
    .regex(/(?=.*[A-Z])/, { message: 'A senha deve conter pelo menos uma letra maiúscula.' })
    .regex(/(?=.*[0-9])/, { message: 'A senha deve conter pelo menos um número.' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onRegister: SubmitHandler<RegisterFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      const userProfileData = {
        uid: user.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
      };
      
      const userDocRef = doc(firestore, "users", user.uid);

      // Non-blocking write with contextual error handling
      setDoc(userDocRef, userProfileData)
        .then(() => {
            toast({
              title: 'Sucesso!',
              description: 'Sua conta foi criada. Você já está logado.',
            });
            router.push('/dashboard');
        })
        .catch((error) => {
            const permissionError = new FirestorePermissionError({
              path: userDocRef.path,
              operation: 'create',
              requestResourceData: userProfileData,
            });
            errorEmitter.emit('permission-error', permissionError);
            
            // Also show a toast to the user
             toast({
              variant: 'destructive',
              title: 'Erro de Permissão',
              description: 'Não foi possível salvar os dados do perfil.',
            });
        });

    } catch (error: any) {
      // This will catch errors from createUserWithEmailAndPassword (e.g., email already in use)
      toast({
        variant: 'destructive',
        title: 'Erro ao criar conta',
        description: error.code === 'auth/email-already-in-use' 
            ? 'Este e-mail já está em uso.'
            : 'Ocorreu um erro inesperado. Tente novamente.',
      });
    } finally {
      // We set loading to false here, but the navigation/success toast is now in the .then() block
      setIsLoading(false);
    }
  };

  const onLogin: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: 'Login realizado com sucesso!',
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer login',
        description: 'Email ou senha inválidos. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotPassword = async () => {
    if (!resetEmail) {
        toast({
            variant: 'destructive',
            title: 'Campo obrigatório',
            description: 'Por favor, insira seu e-mail.',
        });
        return;
    }
    setIsLoading(true);
    try {
        await sendPasswordResetEmail(auth, resetEmail);
        toast({
            title: 'E-mail enviado!',
            description: 'Verifique sua caixa de entrada para o link de redefinição de senha.',
        });
    } catch (error: any) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Erro ao enviar e-mail',
            description: 'Não foi possível enviar o e-mail. Verifique se o endereço está correto.',
        });
    } finally {
        setIsLoading(false);
        setResetEmail("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <div className="w-full max-w-md p-4">
        <div className="flex justify-center mb-8">
            <Image src="https://i.imgur.com/ihAZlua.png" alt="Konstrupages Logo" width={64} height={64} />
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                Konstrupages
            </CardTitle>
            <CardDescription>
              Crie sua conta ou acesse sua plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Acessar</TabsTrigger>
                <TabsTrigger value="register">Criar Conta</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="seu@email.com" {...registerLogin('email')} />
                    {loginErrors.email && <p className="text-xs text-destructive">{loginErrors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Input id="login-password" type={showPassword ? 'text' : 'password'} {...registerLogin('password')} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                     {loginErrors.password && <p className="text-xs text-destructive">{loginErrors.password.message}</p>}
                  </div>

                  <div className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="link" type="button" className="p-0 h-auto text-xs">
                          Esqueceu a senha?
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Redefinir Senha</AlertDialogTitle>
                          <AlertDialogDescription>
                            Digite seu e-mail abaixo. Enviaremos um link para você redefinir sua senha.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-2">
                            <Label htmlFor="reset-email" className="sr-only">Email</Label>
                            <Input
                                id="reset-email"
                                type="email"
                                placeholder="seu@email.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                            />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={onForgotPassword} disabled={isLoading}>
                             {isLoading ? <Loader2 className="animate-spin" /> : 'Enviar Link'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <LogIn className="mr-2" />}
                    Entrar
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome Completo</Label>
                    <Input id="register-name" placeholder="Seu nome" {...registerRegister('name')} />
                    {registerErrors.name && <p className="text-xs text-destructive">{registerErrors.name.message}</p>}
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="register-phone">Telefone</Label>
                    <Input id="register-phone" type="tel" placeholder="Apenas números" {...registerRegister('phone')} />
                    {registerErrors.phone && <p className="text-xs text-destructive">{registerErrors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" type="email" placeholder="seu@email.com" {...registerRegister('email')} />
                    {registerErrors.email && <p className="text-xs text-destructive">{registerErrors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <div className="relative">
                      <Input id="register-password" type={showPassword ? 'text' : 'password'} {...registerRegister('password')} />
                       <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {registerErrors.password && <p className="text-xs text-destructive">{registerErrors.password.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <UserPlus className="mr-2" />}
                    Criar Conta Grátis
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    

    

    