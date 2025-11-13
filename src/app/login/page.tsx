'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, LogIn } from 'lucide-react';
import Image from 'next/image';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  phone: z.string().min(10, { message: 'O telefone deve ter pelo menos 10 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
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
      
      // Save user name and phone to Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
      });

      toast({
        title: 'Sucesso!',
        description: 'Sua conta foi criada. Você já está logado.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao criar conta',
        description: error.message,
      });
    } finally {
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
                    <Input id="login-password" type="password" {...registerLogin('password')} />
                     {loginErrors.password && <p className="text-xs text-destructive">{loginErrors.password.message}</p>}
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
                    <Input id="register-phone" type="tel" placeholder="(00) 00000-0000" {...registerRegister('phone')} />
                    {registerErrors.phone && <p className="text-xs text-destructive">{registerErrors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" type="email" placeholder="seu@email.com" {...registerRegister('email')} />
                    {registerErrors.email && <p className="text-xs text-destructive">{registerErrors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <Input id="register-password" type="password" {...registerRegister('password')} />
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
