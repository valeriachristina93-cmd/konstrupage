

import type { PageConfig } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

const desktopHero = PlaceHolderImages.find((p) => p.id === 'desktop-hero');
const mobileHero = PlaceHolderImages.find((p) => p.id === 'mobile-hero');
const exitPopup = PlaceHolderImages.find((p) => p.id === 'exit-popup');


export const initialPageConfig: PageConfig = {
    desktopImage: desktopHero?.imageUrl ?? 'https://picsum.photos/seed/desktop/2070/900',
    mobileImage: desktopHero?.imageUrl ?? 'https://picsum.photos/seed/desktop/2070/900',
    imageHeightDesktop: 100,
    imageHeightMobile: 100,
    affiliateLink: '',
    newTab: true,
    autoRedirect: { active: false, time: 5 },
    popups: {
        cookies: { active: false, message: 'Usamos cookies para melhorar sua experiência. Ao continuar a navegar, você concorda com a nossa utilização de cookies.', buttonText: 'Aceitar' },
        ageVerification: { active: false },
        discount: { active: false, text: '25% de Desconto', description: 'Oferta por tempo limitado!', icon: true },
        exit: { active: false, imageUrl: exitPopup?.imageUrl ?? 'https://i.imgur.com/n1oqLb9.jpeg', redirectLink: '' },
        custom: { active: false, title: 'Título do Pop-up', description: 'Esta é a descrição do seu pop-up personalizado. Você pode editar este texto.', buttonText: 'Clique Aqui' },
        choice: { active: false, title: 'Selecione seu idioma', description: 'Escolha seu idioma para continuar.', useCustomImages: false, image1Url: 'https://flagcdn.com/w320/br.png', image2Url: 'https://flagcdn.com/w320/us.png', customImageWidth: 120 },
        captcha: { active: false, title: 'Verificação Rápida', description: 'Clique abaixo para provar que você não é um robô e continuar.' }
    },
    footer: { active: false, privacyLink: '#', termsLink: '#', backgroundColor: '#111827', textColor: '#D1D5DB' },
    disclaimer: { active: false, text: 'Este é um anúncio. Os resultados podem variar e não são garantidos.', backgroundColor: '#F3F4F6', textColor: '#4B5563' },
    overlay: { active: false, opacity: 0.5 },
    blur: { active: false, intensity: 5 },
    customization: {
        button: {
            color: '#3B82F6',
            width: 100,
            borderRadius: 6,
            alignment: 'center',
            shadow: {
                active: false,
                intensity: 4,
            },
        },
        popupColor: '#1F2937',
        popupPosition: 'center',
        customHtml: '',
        showCloseButton: false,
        popupContour: {
            active: false,
            width: 2,
            style: 'solid',
            color: '#3B82F6',
        },
        popupAnimation: 'fadeIn',
        popupAnimationDuration: 0.4,
        shadow: {
            active: false,
            intensity: 10,
        },
    }
};

export const buttonColorOptions = [
    { name: 'Azul', value: '#3B82F6' }, { name: 'Roxo', value: '#8B5CF6' },
    { name: 'Verde', value: '#22C55E' }, { name: 'Vermelho', value: '#EF4444' },
    { name: 'Laranja', value: '#F97316' }, { name: 'Amarelo', value: '#EAB308' },
    { name: 'Preto', value: '#1F2937' }, { name: 'Branco', value: '#FFFFFF' }
];

export const popupColorOptions = [
    { name: 'Escuro', value: 'dark' }, { name: 'Branco', value: 'white' },
    { name: 'Cinza Claro', value: 'light-gray' }, { name: 'Cinza Escuro', value: 'dark-gray' }
];

export const animationOptions = [
    { name: 'Fade In', value: 'fadeIn' },
    { name: 'Slide from Top', value: 'slideInDown' },
    { name: 'Slide from Bottom', value: 'slideInUp' },
    { name: 'Zoom In', value: 'zoomIn' },
];

export const flagOptions = [
    { name: 'Brasil', value: 'https://flagcdn.com/w320/br.png' },
    { name: 'Estados Unidos', value: 'https://flagcdn.com/w320/us.png' },
    { name: 'Portugal', value: 'https://flagcdn.com/w320/pt.png' },
    { name: 'Espanha', value: 'https://flagcdn.com/w320/es.png' },
    { name: 'Argentina', value: 'https://flagcdn.com/w320/ar.png' },
    { name: 'México', value: 'https://flagcdn.com/w320/mx.png' },
    { name: 'Colômbia', value: 'https://flagcdn.com/w320/co.png' },
    { name: 'Reino Unido', value: 'https://flagcdn.com/w320/gb.png' },
    { name: 'Canadá', value: 'https://flagcdn.com/w320/ca.png' },
    { name: 'Austrália', value: 'https://flagcdn.com/w320/au.png' },
    { name: 'Alemanha', value: 'https://flagcdn.com/w320/de.png' },
    { name: 'França', value: 'https://flagcdn.com/w320/fr.png' },
    { name: 'Itália', value: 'https://flagcdn.com/w320/it.png' },
    { name: 'Japão', value: 'https://flagcdn.com/w320/jp.png' },
    { name: 'China', value: 'https://flagcdn.com/w320/cn.png' },
    { name: 'Índia', value: 'https://flagcdn.com/w320/in.png' },
    { name: 'União Europeia', value: 'https://flagcdn.com/w320/eu.png' },
];



