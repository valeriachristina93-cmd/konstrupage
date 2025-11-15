

import type { PageConfig, PostPageConfig } from './definitions';
import { PlaceHolderImages } from './placeholder-images';
import type { TranslationKey } from './translations';

const exitPopup = PlaceHolderImages.find((p) => p.id === 'exit-popup');

export const getInitialPageConfig = (t: (key: TranslationKey) => string): PageConfig => ({
    desktopImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    mobileImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageHeightDesktop: 100,
    imageHeightMobile: 100,
    affiliateLink: '',
    newTab: false,
    fullPageClick: false,
    autoRedirect: { active: false, time: 5 },
    popups: {
        cookies: { active: false, title: t('default_cookie_title'), message: t('default_cookie_message'), buttonText: t('default_cookie_button') },
        ageVerification: { active: false, message: t('default_age_message'), yesButtonText: t('default_age_yes'), noButtonText: t('default_age_no'), yesButtonColor: '#3B82F6', noButtonColor: '#6B7280', buttonWidth: 48 },
        discount: { active: false, text: t('default_discount_text'), description: t('default_discount_description'), icon: 'percent', iconSize: 48 },
        exit: { 
            active: false, 
            imageUrl: exitPopup?.imageUrl ?? 'https://i.imgur.com/n1oqLb9.jpeg', 
            redirectLink: '', 
            imageOnly: false,
            title: t('default_exit_title'),
            description: t('default_exit_description'),
            buttonText: t('default_exit_button')
        },
        custom: { 
            active: false, 
            triggerOnExit: false,
            title: t('default_custom_title'),
            description: t('default_custom_description'),
            buttonText: t('default_custom_button'),
            imageUrl: 'https://picsum.photos/seed/1/600/400',
            imageLayout: 'none',
            imageSide: 'left',
            imageSideWidth: 40,
            imageInner: {
                active: false,
                imageUrl: 'https://picsum.photos/seed/2/400/200',
                width: 100
            },
            secondButton: {
                active: false,
                text: t('default_custom_second_button'),
                link: '#',
                style: 'filled',
                color: '#6B7280',
                textColor: '#FFFFFF',
                outlineWidth: 2,
                width: 100,
            },
            buttonsAlignment: 'vertical',
            countdown: {
                active: false,
                time: '00:15:00',
                position: 'belowText',
                style: 'style1',
                color: '#FFFFFF',
                fontSize: 24,
                boxColor: '#000000',
            },
        },
        choice: { active: false, title: t('default_choice_title'), description: t('default_choice_description'), useCustomImages: false, image1Url: 'https://flagcdn.com/w160/br.png', image2Url: 'https://flagcdn.com/w160/us.png', customImageWidth: 120 },
        gender: { active: false, title: t('default_gender_title'), description: t('default_gender_description'), iconSize: 48, useCustomImages: false, includeOther: false, maleImageUrl: '', femaleImageUrl: '', otherImageUrl: '', maleText: t('default_gender_male'), femaleText: t('default_gender_female'), otherText: t('default_gender_other') },
        captcha: { 
            active: false, 
            title: t('default_captcha_title'), 
            description: t('default_captcha_description'), 
            captchaType: 'checkbox',
            sliderButtonColor: '#3B82F6',
            sliderTrackColor: '#e9ecef',
            sliderTextColor: '#6c757d',
            sliderSuccessTextColor: '#FFFFFF',
            sliderText: t('default_captcha_slider_text'),
            sliderSuccessText: t('default_captcha_slider_success_text'),
            sliderShape: 'round',
            checkboxText: t('default_captcha_checkbox_text'),
        }
    },
    footer: { active: false, privacyLink: '#', termsLink: '#', backgroundColor: '#111827', textColor: '#D1D5DB', autoGenerate: false },
    disclaimer: { 
        active: false, 
        content: [{ type: 'text', text: t('default_disclaimer_text') }],
        backgroundColor: '#F3F4F6', 
        textColor: '#4B5563',
    },
    overlay: { active: false, opacity: 0.5 },
    blur: { active: false, intensity: 3 },
    tracking: {
        facebookPixelId: '',
        googleAdsId: '',
        cookieLoader: {
            active: false,
            link: '',
            time: 3,
        },
    },
    seo: {
        title: 'Site Page',
        description: '',
        favicon: 'https://i.imgur.com/Lo98kWM.png',
    },
    postPages: [],
    customization: {
        button: {
            color: '#3B82F6',
            textColor: '#FFFFFF',
            width: 100,
            borderRadius: 6,
            alignment: 'center',
            shadow: {
                active: false,
                intensity: 4,
            },
            style: 'filled',
            outlineWidth: 2,
        },
        typography: {
            titleColor: '#FFFFFF',
            textColor: '#E5E7EB',
            titleSize: 19,
            textSize: 16,
            fontFamily: 'Inter',
        },
        popup: {
            maxWidth: 500,
            borderRadius: 12,
            paddingX: 24,
            paddingY: 24,
            gap: 16,
            backgroundColor: '#1F2937',
            titleBottomMargin: 12,
            descriptionBottomMargin: 16,
        },
        popupPosition: 'center',
        customHtml: '',
        showCloseButton: true,
        closeButtonColor: '#FFFFFF',
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
});

export const discountIconOptions = [
    { name: 'Nenhum', value: 'none' },
    { name: 'Porcentagem', value: 'percent' },
    { name: 'Sacola', value: 'shopping-bag' },
    { name: 'Cupom', value: 'ticket-percent' },
    { name: 'Relógio', value: 'clock' },
    { name: 'Carrinho', value: 'shopping-cart' },
    { name: 'Coração', value: 'heart' },
    { name: 'Presente', value: 'gift' },
];

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
    { name: 'Brasil', value: 'https://flagcdn.com/w160/br.png' },
    { name: 'Estados Unidos', value: 'https://flagcdn.com/w160/us.png' },
    { name: 'Portugal', value: 'https://flagcdn.com/w160/pt.png' },
    { name: 'Espanha', value: 'https://flagcdn.com/w160/es.png' },
    { name: 'Argentina', value: 'https://flagcdn.com/w160/ar.png' },
    { name: 'México', value: 'https://flagcdn.com/w160/mx.png' },
    { name: 'Colômbia', value: 'https://flagcdn.com/w160/co.png' },
    { name: 'Reino Unido', value: 'https://flagcdn.com/w160/gb.png' },
    { name: 'Canadá', value: 'https://flagcdn.com/w160/ca.png' },
    { name: 'Alemanha', value: 'https://flagcdn.com/w160/de.png' },
    { name: 'França', value: 'https://flagcdn.com/w160/fr.png' },
    { name: 'Itália', value: 'https://flagcdn.com/w160/it.png' },
    { name: 'Japão', value: 'https://flagcdn.com/w320/jp.png' },
    { name: 'China', value: 'https://flagcdn.com/w320/cn.png' },
    { name: 'Índia', value: 'https://flagcdn.com/w320/in.png' },
    { name: 'União Europeia', value: 'https://flagcdn.com/w320/eu.png' },
];


export const fontOptions = [
  { name: 'Inter', value: 'Inter', import: 'Inter:wght@400;500;700' },
  { name: 'Space Grotesk', value: 'Space Grotesk', import: 'Space+Grotesk:wght@400;500;700' },
  { name: 'Roboto', value: 'Roboto', import: 'Roboto:wght@400;500;700' },
  { name: 'Montserrat', value: 'Montserrat', import: 'Montserrat:wght@400;500;700' },
  { name: 'Poppins', value: 'Poppins', import: 'Poppins:wght@400;500;700' },
  { name: 'Lato', value: 'Lato', import: 'Lato:wght@400;700' },
  { name: 'Open Sans', value: 'Open Sans', import: 'Open+Sans:wght@400;600;700' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro', import: 'Source+Sans+Pro:wght@400;600;700' }
];


    
