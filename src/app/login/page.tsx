
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, Sparkles, Star, MessageSquare, Link2, Shield, Palette, PlayCircle, BarChart, Users, MousePointerClick, Rocket, Ghost, Cookie, Target, Video, Hand, ShieldCheck, Loader2, Globe, CreditCardIcon, ArrowRight, Bot, Phone, UserCheck, Cake, Percent, Settings2, ShoppingCart, CheckCircle, Code, Copy, Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import Script from 'next/script';
import { cn } from '@/lib/utils';


const salesData = [
    { location: 'São Paulo, SP', value: 241.83, currency: 'BRL' },
    { location: 'Belo Horizonte, MG', value: 327.62, currency: 'BRL' },
    { location: 'Rio de Janeiro, RJ', value: 457.42, currency: 'BRL' },
    { location: 'Miami, FL', value: 292.12, currency: 'USD' },
    { location: 'Curitiba, PR', value: 199.90, currency: 'BRL' },
    { location: 'Lisboa, Portugal', value: 350.50, currency: 'EUR' },
];

const SalesNotification = ({ sale, position, animation }: { sale: typeof salesData[0]; position: string; animation: string }) => {
    const formatCurrency = (value: number, currency: string) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency,
        }).format(value);
    };

    return (
        <div className={`absolute ${position} z-20 hidden lg:flex`}>
            <div className={`p-3 rounded-lg bg-gray-800/60 backdrop-blur-md border border-white/10 shadow-lg ${animation}`}>
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-green-500/20 text-green-400 rounded-full">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                         <p className="text-sm font-semibold text-white">Venda aprovada!</p>
                         <p className="text-xs text-gray-300">Valor: {formatCurrency(sale.value, sale.currency)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function SalesPage() {
    const { isLoggedIn, loading, login } = useAuth();
    const router = useRouter();
     const [isSigningUp, setIsSigningUp] = useState(false);

    useEffect(() => {
        if (!loading && isLoggedIn) {
            router.replace('/editor');
        }
    }, [isLoggedIn, loading, router]);
    
    const handleLogin = () => {
        setIsSigningUp(true);
        login();
    };


    if (loading || isLoggedIn) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }
    
    const presellTypes = [
        {
            icon: <Cookie className="w-8 h-8 text-primary" />,
            title: 'Presell com Pop-up de Cookies',
            description: 'Use um aviso de cookies para marcar seu pixel de afiliado assim que o visitante chega. Ao aceitar, o lead é redirecionado para la oferta final, garantindo sua comissão.',
            imageUrl: 'https://i.imgur.com/IhcwPI4.png',
        },
        {
            icon: <UserCheck className="w-8 h-8 text-primary" />,
            title: 'Presell com Verificação de Idade',
            description: 'Ideal para produtos +18. Qualifique seu público e, após a confirmação, redirecione o tráfego qualificado diretamente para a página de vendas, com seu cookie já marcado.',
            imageUrl: 'https://i.imgur.com/racTuDm.png',
        },
        {
            icon: <Percent className="w-8 h-8 text-primary" />,
            title: 'Presell com Pop-up de Desconto',
            description: 'Capture a atenção com uma oferta especial. Ao clicar no botão para "aproveitar", o lead é direcionado para la oferta final, aumentando a conversão com o cookie rastreado.',
            imageUrl: 'https://i.imgur.com/961oS9W.png',
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-primary" />,
            title: 'Presell com Pop-up de Captcha',
            description: 'Proteja sua página contra bots. Após o visitante provar que é humano, ele é automaticamente redirecionado para la oferta, garantindo que apenas tráfego real marque seu cookie.',
            imageUrl: 'https://i.imgur.com/SG1HaLn.png',
        },
        {
            icon: <Globe className="w-8 h-8 text-primary" />,
            title: 'Presell com Pop-up de Escolha',
            description: 'Segmente seu público por país ou gênero. A escolha do visitante o redireciona para la oferta mais relevante, garantindo a marcação do cookie e uma experiência personalizada.',
            imageUrl: 'https://i.imgur.com/FIere9t.png',
        },
         {
            icon: <Settings2 className="w-8 h-8 text-primary" />,
            title: 'Presell com Pop-up Personalizado',
            description: 'Crie qualquer tipo de pop-up com textos, imagens e botões. Configure o fluxo ideal para aquecer seu lead antes de redirecioná-lo para la oferta com seu cookie marcado.',
            imageUrl: 'https://i.imgur.com/1lqJplT.png',
        },
        {
            icon: <Ghost className="w-8 h-8 text-primary" />,
            title: 'Presell Fantasma',
            description: 'Camufle sua página como um site de conteúdo (receita, notícia). O clique do visitante redireciona para a sua oferta, marcando o cookie de forma discreta para passar em moderações rigorosas.',
            imageUrl: 'https://i.imgur.com/8y2uRdI.png',
        }
    ];

    const testimonials = [
        {
            name: 'João P., Afiliado Profissional',
            quote: 'O konstrupages mudou o jogo para mim. A facilidade de criar presells otimizadas e o modo "blindar" são incríveis. Minhas conversões aumentaram 30%!',
            avatar: 'JP',
        },
        {
            name: 'Maria S., Gestora de Tráfego',
            quote: 'Eu economizo horas de trabalho. Antes, eu dependia de freelancers. Agora, crio páginas de alta qualidade em minutos e posso testar diferentes abordagens rapidamente.',
            avatar: 'MS',
        },
        {
            name: 'Carlos A., Produtor Digital',
            quote: 'Recomendo o konstrupages para todos os meus afiliados. A ferramenta é simples, poderosa e resolve uma dor real do mercado. Indispensável!',
            avatar: 'CA',
        },
        {
            name: 'Ana B., Empreendedora',
            quote: 'Ferramenta fantástica! A interface é super intuitiva e o suporte é ágil. Consegui aumentar meu ROI em poucas semanas.',
            avatar: 'AB',
        },
        {
            name: 'Lucas F., Especialista em Mídia Paga',
            quote: 'A função de "Clique Total" é simplesmente genial. Perfeita para maximizar o aproveitamento do tráfego em campanhas específicas. Resultados impressionantes!',
            avatar: 'LF',
        },
        {
            name: 'Mariana C., Afiliada Iniciante',
            quote: 'Como iniciante, o konstrupages me deu a confiança para criar minhas próprias presells sem precisar de um designer. É fácil e os resultados aparecem rápido.',
            avatar: 'MC',
        }
    ];
    
     const faqs = [
        {
            question: 'O que é uma página de presell?',
            answer: 'Uma página de presell (ou pré-venda) serve como uma ponte entre seu anúncio e a página de vendas do produto. Ela "aquece" o visitante, aumenta a consciência sobre a solução e qualifica o clique, resultando em taxas de conversão mais altas.'
        },
        {
            question: 'Preciso saber programar para usar o konstrupages?',
            answer: 'Não! O konstrupages é uma ferramenta 100% no-code. Você personaliza tudo através de uma interface visual intuitiva e, ao final, apenas copia e cola o código HTML gerado onde precisar.'
        },
        {
            question: 'Onde hospedo a página que o konstrupages gera?',
            answer: 'O konstrupages gera um arquivo HTML puro. Você pode hospedar este arquivo em qualquer lugar: no seu próprio site (WordPress, etc.), em serviços de hospedagem como Vercel, Netlify, ou até mesmo em serviços gratuitos de hospedagem de sites estáticos.'
        },
        {
            question: 'Posso usar em qualquer plataforma de anúncios?',
            answer: 'Sim! As páginas geradas são HTML puro, compatíveis com qualquer plataforma de anúncios como Facebook Ads, Google Ads, Taboola, TikTok Ads, etc. Você pode hospedar o arquivo em seu próprio site ou em serviços de hospedagem gratuitos.'
        },
        {
            question: 'Posso cancelar minha assinatura a qualquer momento?',
            answer: 'Sim. Você pode gerenciar e cancelar sua assinatura a qualquer momento diretamente no seu painel de usuário, sem burocracia.'
        }
    ];

    const powerFeatures = [
        {
            icon: <Rocket className="w-8 h-8 text-primary" />,
            title: "Redirecionamento Automático",
            description: "Leve o usuário para la oferta automaticamente após alguns segundos, garantindo a marcação do seu cookie de afiliado."
        },
        {
            icon: <Ghost className="w-8 h-8 text-primary" />,
            title: "Pop-up de Intenção de Saída",
            description: "Recupere visitantes prestes a sair com uma oferta de última hora, um vídeo ou um link especial para maximizar cada clique."
        },
        {
            icon: <Cookie className="w-8 h-8 text-primary" />,
            title: "Marcação de Cookie Oculta",
            description: "Carregue sua página de afiliado em segundo plano, sem que o usuário perceba, para garantir sua comissão em vendas futuras."
        },
        {
            icon: <Code className="w-8 h-8 text-primary" />,
            title: "Scripts Personalizados",
            description: "Insira seus próprios códigos HTML, CSS ou JavaScript. Adicione pixels de rastreamento, analytics ou qualquer outra customização."
        },
        {
            icon: <Copy className="w-8 h-8 text-primary" />,
            title: "Páginas Ilimitadas",
            description: "No plano PRO, não há limites. Crie e teste quantas páginas de presell você precisar para otimizar suas campanhas ao máximo."
        },
        {
            icon: <Palette className="w-8 h-8 text-primary" />,
            title: "Estilização Completa",
            description: "Tenha controle total sobre o design dos seus pop-ups: cores, fontes, tamanhos, bordas e muito mais para combinar com sua marca."
        }
    ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Script src="https://fast.wistia.com/assets/external/E-v1.js" async />
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-2">
                     <Image src="https://i.imgur.com/ihAZlua.png" alt="konstrupages Logo" width={32} height={32} />
                     <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                        konstrupages
                    </h1>
                </Link>
                <nav className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="sm" onClick={handleLogin}>Entrar</Button>
                    <Button 
                        size="sm" 
                        onClick={handleLogin}
                        disabled={isSigningUp}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                        {isSigningUp ? <Loader2 className="animate-spin" /> : 'Criar Conta Grátis'}
                    </Button>
                </nav>
            </div>
        </header>

        <main className="flex-1">
            {/* Hero Section */}
            <section
              className="relative py-12 sm:py-20 text-center overflow-hidden bg-background"
            >
                <div className="container relative z-10 px-4">

                    <SalesNotification sale={salesData[0]} position="top-1/3 left-8" animation="float-up-1" />
                    <SalesNotification sale={salesData[1]} position="top-1/4 right-8" animation="float-up-2" />
                    <SalesNotification sale={salesData[2]} position="bottom-20 left-8" animation="float-up-3" />
                    <SalesNotification sale={salesData[3]} position="bottom-1/4 right-8" animation="float-up-4" />
                    <SalesNotification sale={salesData[4]} position="top-[55%] left-8" animation="float-up-5" />
                    <SalesNotification sale={salesData[5]} position="top-[45%] right-8" animation="float-up-6" />
                    
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mt-8">
                        Crie Presells de Alta Conversão em Minutos
                    </h2>
                    <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
                        A ferramenta definitiva para afiliados e gestores de tráfego. Pare de perder dinheiro com bloqueios e páginas lentas.
                    </p>
                    
                    <div className="max-w-4xl mx-auto mt-10 sm:mt-12">
                        <div className="aspect-video rounded-xl border bg-muted/30 shadow-2xl overflow-hidden p-1.5 shadow-primary/10">
                             <div style={{padding: '56.25% 0 0 0', position: 'relative'}} className="rounded-lg overflow-hidden">
                                <iframe 
                                    src="https://fast.wistia.net/embed/iframe/r8nzdjmryo?videoFoam=true" 
                                    title="konstrupages Video" 
                                    allow="autoplay; fullscreen" 
                                    frameBorder="0" 
                                    scrolling="no" 
                                    className="wistia_embed" 
                                    name="wistia_embed" 
                                    allowFullScreen 
                                    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                                </iframe>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center">
                         <Button 
                            size="lg"
                            onClick={handleLogin}
                            disabled={isSigningUp}
                            className="w-full sm:w-auto text-lg h-14 px-10 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
                         >
                            {isSigningUp ? <Loader2 className="animate-spin" /> : 'Quero construir minha presell'}
                        </Button>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-muted-foreground">Comece a lucrar mais hoje mesmo.</p>
                    </div>

                </div>
            </section>
            
            {/* Features Section */}
            <section id="features" className="py-20 sm:py-24 bg-muted/20">
                <div className="container px-4 space-y-16 sm:space-y-24">
                     <div className="text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold">Pop-ups Poderosos para Cada Estratégia</h2>
                        <p className="max-w-xl mx-auto mt-3 text-muted-foreground">
                           Use os pop-ups certos para qualificar seu tráfego, aumentar o engajamento e maximizar suas conversões.
                        </p>
                    </div>
                    {presellTypes.map((feature, index) => (
                        <div key={index} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                            <div className={cn('md:order-2', index % 2 === 0 ? 'md:order-2' : 'md:order-1')}>
                                <div className="rounded-lg transition-all">
                                    <Image
                                        src={feature.imageUrl}
                                        alt={feature.title}
                                        width={700}
                                        height={467}
                                        className="w-full h-auto rounded-md shadow-lg"
                                    />
                                </div>
                            </div>
                            <div className={cn('space-y-4', index % 2 === 0 ? 'md:order-1' : 'md:order-2')}>
                                <div className="inline-block p-3 rounded-lg bg-primary/10">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold">{feature.title}</h3>
                                <p className="text-muted-foreground text-lg">{feature.description}</p>
                                <Button 
                                    size="sm" 
                                    onClick={handleLogin}
                                    disabled={isSigningUp}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                     {isSigningUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Criar Conta Grátis <ArrowRight className="ml-2 h-4 w-4" /></>}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

             {/* Power Features Section */}
            <section id="power-features" className="py-20 sm:py-24">
                <div className="container px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold">Ferramentas Poderosas para Maximizar seu ROI</h2>
                        <p className="max-w-2xl mx-auto mt-3 text-muted-foreground">
                            Funcionalidades avançadas pensadas para afiliados que buscam controle total e performance máxima.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {powerFeatures.map((feature, index) => (
                            <div key={index} className="p-6 bg-muted/20 border border-border/50 rounded-lg transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:border-primary/50">
                                <div className="inline-block p-3 rounded-lg bg-primary/10 mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


             {/* Testimonials Section */}
            <section id="testimonials" className="py-20 sm:py-24 relative overflow-hidden bg-muted/20">
                <div className="container px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold">O que Nossos Usuários Dizem</h2>
                        <p className="max-w-xl mx-auto mt-3 text-muted-foreground">
                           Veja o que usuários reais estão dizendo sobre o impacto do konstrupages em seus negócios.
                        </p>
                    </div>
                     <div className="md:hidden grid grid-cols-1 gap-6">
                        {testimonials.slice(0, 3).map((testimonial, index) => (
                           <Card key={`mobile-${index}`} className="w-full flex-shrink-0 bg-background/50">
                                <CardContent className="pt-8">
                                    <Quote className="w-8 h-8 text-primary/50 mb-4" />
                                    <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                                </CardContent>
                                <CardFooter>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-muted text-primary font-bold flex items-center justify-center text-lg">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">{testimonial.name}</p>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    <div className="hidden md:block marquee-container">
                        <div className="marquee-content">
                            {[...testimonials, ...testimonials].map((testimonial, index) => (
                               <Card key={`fwd-${index}`} className="w-80 flex-shrink-0 bg-background/50">
                                    <CardContent className="pt-8">
                                        <Quote className="w-8 h-8 text-primary/50 mb-4" />
                                        <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-muted text-primary font-bold flex items-center justify-center text-lg">
                                                {testimonial.avatar}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">{testimonial.name}</p>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

             {/* Guarantee Section */}
            <section id="guarantee" className="py-20 sm:py-24">
                <div className="container px-4 max-w-4xl mx-auto">
                    <div className="text-center border-2 border-dashed border-primary/50 rounded-xl p-8 bg-muted/30">
                        <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-primary" />
                        <h2 className="text-3xl sm:text-4xl font-bold">Totalmente Gratuito</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                            Aproveite todos os recursos da ferramenta sem custo algum. Crie quantas páginas precisar e otimize suas campanhas ao máximo.
                        </p>
                        <div className="mt-8">
                             <Button 
                                size="lg" 
                                onClick={handleLogin}
                                disabled={isSigningUp}
                                className="font-semibold text-lg py-7 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                                {isSigningUp ? <Loader2 className="animate-spin" /> : 'Começar a Usar de Graça'}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

             {/* FAQ Section */}
            <section id="faq" className="py-20 sm:py-24">
                <div className="container px-4 max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold">Ainda tem Dúvidas?</h2>
                        <p className="mt-3 text-muted-foreground">
                            Respostas para as perguntas mais comuns sobre o konstrupages.
                        </p>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>
        </main>
        
        {/* New Complete Footer */}
        <footer className="bg-muted/20 border-t border-border/50">
            <div className="container py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Coluna 1: Logo e Descrição */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2">
                            <Image src="https://i.imgur.com/ihAZlua.png" alt="konstrupages Logo" width={32} height={32} />
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">konstrupages</h1>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">A ferramenta definitiva para afiliados e gestores de tráfego, focada em maximizar suas conversões com presells de alta performance.</p>
                    </div>
                    {/* Coluna 2: Navegação */}
                    <div>
                        <h4 className="font-semibold">Navegação</h4>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Funcionalidades</a></li>
                            <li><a href="#planos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Planos</a></li>
                            <li><a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
                        </ul>
                    </div>
                    {/* Coluna 3: Legal */}
                    <div>
                        <h4 className="font-semibold">Legal</h4>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Política de Privacidade</Link></li>
                            <li><Link href="/terms-of-use" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Termos de Uso</Link></li>
                            <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contato</Link></li>
                        </ul>
                    </div>
                </div>
                 <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} konstrupages. Todos os direitos reservados.</p>
                    <p className="mt-1">Feito com ❤️ por konstrupages</p>
                </div>
            </div>
        </footer>
    </div>
  );
}

    