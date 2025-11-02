
import type { PageConfig } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

const desktopHero = PlaceHolderImages.find((p) => p.id === 'desktop-hero');
const mobileHero = PlaceHolderImages.find((p) => p.id === 'mobile-hero');
const exitPopup = PlaceHolderImages.find((p) => p.id === 'exit-popup');


export const initialPageConfig: PageConfig = {
    desktopImage: desktopHero?.imageUrl ?? 'https://picsum.photos/seed/desktop/2070/900',
    mobileImage: mobileHero?.imageUrl ?? 'https://picsum.photos/seed/mobile/1080/1000',
    imageHeightDesktop: 100,
    imageHeightMobile: 100,
    affiliateLink: '',
    newTab: true,
    autoRedirect: { active: false, time: 5 },
    popups: {
        cookies: { active: false, message: 'Usamos cookies para melhorar sua experiência. Ao continuar a navegar, você concorda com a nossa utilização de cookies.' },
        ageVerification: { active: false },
        discount: { active: false, text: '25% de Desconto', icon: true },
        exit: { active: false, imageUrl: exitPopup?.imageUrl ?? 'https://picsum.photos/seed/exit/800/450', redirectLink: '' },
        custom: { active: false, title: 'Título do Pop-up', description: 'Esta é a descrição do seu pop-up personalizado. Você pode editar este texto.', buttonText: 'Clique Aqui' }
    },
    footer: { active: false, privacyLink: '#', termsLink: '#', theme: 'dark' },
    disclaimer: { active: false, text: 'Este é um anúncio. Os resultados podem variar e não são garantidos.' },
    overlay: { active: false, opacity: 0.5 },
    blur: { active: false, intensity: 5 },
    customization: {
        language: 'pt-BR',
        buttonColor: '#3B82F6',
        popupColor: 'dark',
        popupPosition: 'center',
        customHtml: ''
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

export const languageOptions = [
    { name: 'Português (BR)', value: 'pt-BR' }, { name: 'Inglês (US)', value: 'en-US' },
    { name: 'Espanhol', value: 'es' }, { name: 'Alemão', value: 'de' }, { name: 'Francês', value: 'fr' }
];






