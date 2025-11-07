
import type { PageConfig } from './definitions';
import { fontOptions } from './constants';

export const generatePresellHtml = (config: PageConfig) => {
    const { 
        desktopImage, mobileImage, imageHeightDesktop, imageHeightMobile, affiliateLink, autoRedirect, newTab, fullPageClick,
        popups, footer, disclaimer, overlay, blur, tracking, customization, seo
    } = config;

    const anyPopupActive = popups.ageVerification.active || popups.captcha.active || popups.custom.active || popups.choice.active || popups.discount.active || popups.cookies.active;

    const getDesktopBgStyle = () => {
        let style = '';
        if (overlay.active && !anyPopupActive) {
            style += `background-image: linear-gradient(rgba(0,0,0,${overlay.opacity}), rgba(0,0,0,${overlay.opacity})), url('${desktopImage}');`;
        } else {
            style += `background-image: url('${desktopImage}');`;
        }
        if (blur.active && !anyPopupActive) {
            style += ` filter: blur(${blur.intensity}px);`;
        }
        return style;
    };
    
    const getMobileBgStyle = () => {
         let style = '';
        if (overlay.active && !anyPopupActive) {
            style += `background-image: linear-gradient(rgba(0,0,0,${overlay.opacity}), rgba(0,0,0,${overlay.opacity})), url('${mobileImage}');`;
        } else {
            style += `background-image: url('${mobileImage}');`;
        }
        if (blur.active && !anyPopupActive) {
            style += ` filter: blur(${blur.intensity}px);`;
        }
        return style;
    };
    
    const selectedFont = fontOptions.find(f => f.value === customization.typography.fontFamily);
    const fontImportUrl = selectedFont ? `https://fonts.googleapis.com/css2?family=${selectedFont.import.replace(/ /g, '+')}&display=swap` : '';


    const typographyStyles = `
        .popup { font-family: '${customization.typography.fontFamily}', sans-serif; }
        .popup h3, .popup h2 { color: ${customization.typography.titleColor}; font-size: ${customization.typography.titleSize}px; margin: 0; margin-bottom: ${customization.popup.titleBottomMargin}px; }
        .popup p { color: ${customization.typography.textColor}; font-size: ${customization.typography.textSize}px; margin: 0; margin-bottom: ${customization.popup.descriptionBottomMargin}px; }
        .popup p a, .popup h2 a, .popup h3 a { color: inherit; }
    `;

    const popupStyles = `background-color: ${customization.popup.backgroundColor}; border-radius: ${customization.popup.borderRadius}px; max-width: ${customization.popup.maxWidth}px;`;
    
    function isColorLight(hexColor: string) {
        if (!hexColor) return true;
        const hex = hexColor.replace('#', '');
        if (hex.length !== 6) return true;
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness > 155;
    }

    const getPopupPositionClass = () => {
        if (customization.popupPosition === 'bottom') {
            return 'popup-bottom';
        }
        if (customization.popupPosition === 'top') {
            return 'popup-top';
        }
        return 'popup-center';
    };

    const getPopupContourStyle = () => {
        if (customization.popupContour.active) {
            const { width, style, color } = customization.popupContour;
            return `border: ${width}px ${style} ${color};`;
        }
        return '';
    }

    const getPopupShadowStyle = () => {
        if (customization.shadow.active) {
            const intensity = customization.shadow.intensity;
            return `box-shadow: 0 0 ${intensity * 2}px rgba(0,0,0,${intensity / 50});`;
        }
        return 'box-shadow: 0 10px 25px rgba(0,0,0,0.2);';
    }

    const getButtonShadowStyle = () => {
        if (customization.button.shadow.active) {
            const intensity = customization.button.shadow.intensity;
            return `box-shadow: 0 ${intensity / 2}px ${intensity}px rgba(0,0,0,0.2);`;
        }
        return 'box-shadow: 0 4px 10px rgba(0,0,0,0.1);';
    }

    const getPopupAnimationClass = () => {
        return `popup-animation-${customization.popupAnimation}`;
    };

    const closeButtonHtml = (popupId: string) => customization.showCloseButton 
        ? `<button class="close-button" onclick="closePopup('${popupId}', event)">&times;</button>`
        : '';

    const getButtonStyle = (buttonConfig: typeof customization.button | typeof popups.custom.secondButton, isPrimary: boolean) => {
        const { style, color, textColor, outlineWidth } = buttonConfig;
        
        let finalStyle = `
            color: ${textColor};
            border-radius: ${customization.button.borderRadius}px;
        `;
    
        if ('width' in buttonConfig) {
             finalStyle += `width: ${buttonConfig.width}%;`
        }

        if (style === 'outline') {
            finalStyle += `
                background-color: transparent;
                border: ${outlineWidth}px solid ${color};
            `;
        } else { // filled
            finalStyle += `
                background-color: ${color};
                border: none;
            `;
        }
        return finalStyle;
    };
    
    const getButtonAlignment = () => {
        switch(customization.button.alignment) {
            case 'left': return 'flex-start';
            case 'right': return 'flex-end';
            case 'center':
            default: return 'center';
        }
    }
    const buttonContainerStyle = `display: flex; justify-content: ${getButtonAlignment()}; width: 100%;`;

    const getDiscountIcon = () => {
        const iconName = popups.discount.icon;
        if (iconName === 'none') return '';
        
        const iconSize = popups.discount.iconSize;
        const iconColor = customization.button.color;
        const iconSvgs: Record<string, string> = {
            'percent': `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>`,
            'shopping-bag': `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
            'ticket-percent': `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path><path d="M9 9h.01"></path><path d="m15 9-6 6"></path><path d="M9 15h.01"></path><path d="M22 9h-4.01"></path><path d="M3 9h4"></path><path d="M22 15h-4.01"></path><path d="M3 15h4"></path></svg>`,
            'clock': `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
            'shopping-cart': `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
            'heart': `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${iconColor}" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
            'gift': `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>`,
        };
        return `<div class="icon-container">${iconSvgs[iconName] || ''}</div>`;
    };

    const popupContentStyles = `padding: ${customization.popup.paddingY}px ${customization.popup.paddingX}px;`;
    const popupStandardGap = `gap: ${customization.popup.gap}px;`;
    
    const cookiePopup = popups.cookies.active ? `
        <div id="cookie-popup" class="popup ${getPopupPositionClass()} ${getPopupAnimationClass()}" style="${popupStyles} ${getPopupContourStyle()}">
            ${closeButtonHtml('cookie-popup')}
            <div class="popup-inner-content" style="${popupContentStyles} ${popupStandardGap}">
                <h3>Políticas de Cookies</h3>
                <p>${popups.cookies.message}</p>
                <div class="button-container" style="${buttonContainerStyle}">
                    <button style="${getButtonStyle(customization.button, true)}" onclick="proceed('cookie-popup')">${popups.cookies.buttonText}</button>
                </div>
            </div>
        </div>
    ` : '';
    
    const agePopup = popups.ageVerification.active ? `
        <div id="age-popup" class="popup ${getPopupPositionClass()} ${getPopupAnimationClass()}" style="${popupStyles} ${getPopupContourStyle()}">
             ${closeButtonHtml('age-popup')}
             <div class="popup-inner-content" style="${popupContentStyles} ${popupStandardGap}">
                <p>${popups.ageVerification.message}</p>
                <div style="display: flex; gap: 10px; justify-content: center; width: 100%;">
                    <button style="background-color: ${popups.ageVerification.yesButtonColor}; color: ${isColorLight(popups.ageVerification.yesButtonColor) ? '#000' : '#fff'}; width: ${popups.ageVerification.buttonWidth}%; border-radius: ${customization.button.borderRadius}px; border: none;" onclick="proceed('age-popup')">${popups.ageVerification.yesButtonText}</button>
                    <button style="background-color: ${popups.ageVerification.noButtonColor}; color: ${isColorLight(popups.ageVerification.noButtonColor) ? '#000' : '#fff'}; width: ${popups.ageVerification.buttonWidth}%; border-radius: ${customization.button.borderRadius}px; border: none;" onclick="window.history.back()">${popups.ageVerification.noButtonText}</button>
                </div>
            </div>
        </div>
    ` : '';

    const discountPopup = popups.discount.active ? `
         <div id="discount-popup" class="popup ${getPopupPositionClass()} ${getPopupAnimationClass()}" style="${popupStyles} ${getPopupContourStyle()}">
             ${closeButtonHtml('discount-popup')}
             <div class="popup-inner-content" style="${popupContentStyles} ${popupStandardGap}">
                ${getDiscountIcon()}
                <h2>${popups.discount.text}</h2>
                <p>${popups.discount.description}</p>
                <div class="button-container" style="${buttonContainerStyle}">
                    <button style="${getButtonStyle(customization.button, true)}" onclick="proceed('discount-popup')">Aproveitar Agora</button>
                </div>
            </div>
        </div>
    ` : '';

    const customPopup = (() => {
        if (!popups.custom.active) return '';
    
        const { title, description, buttonText, imageUrl, imageLayout, imageSide, imageSideWidth, imageInner, secondButton, buttonsAlignment, countdown } = popups.custom;
    
        const countdownHtml = countdown.active ? `
            <div id="custom-countdown" class="countdown-container ${'countdown-' + countdown.style}" style="--countdown-color: ${countdown.color}; --countdown-font-size: ${countdown.fontSize}px; --countdown-box-color: ${countdown.boxColor};">
            </div>
        ` : '';

        const imageHtml = imageUrl && imageLayout !== 'none' 
            ? `<img src="${imageUrl}" class="custom-popup-image" alt="Pop-up Image">` 
            : '';

        const imageInnerHtml = imageInner.active && imageInner.imageUrl
            ? `<img src="${imageInner.imageUrl}" class="custom-popup-image-inner" alt="Inner Pop-up Image" style="width: ${imageInner.width}%; margin-bottom: ${customization.popup.gap}px;">`
            : '';
    
        const mainButtonHtml = `<button style="${getButtonStyle(customization.button, true)}" onclick="proceed('custom-popup')">${buttonText}</button>`;
        const secondButtonHtml = secondButton.active ? `<button style="${getButtonStyle(secondButton, false)}" onclick="redirect('${secondButton.link}')">${secondButton.text}</button>` : '';
        
        const buttonsContainerClass = buttonsAlignment === 'horizontal' ? 'buttons-horizontal' : 'buttons-vertical';
        const buttonsHtml = `<div class="custom-popup-buttons ${buttonsContainerClass}">${mainButtonHtml}${secondButtonHtml}</div>`;
    
        const textWrapperHtml = `
            <div class="text-wrapper">
                ${countdown.active && countdown.position === 'aboveTitle' ? countdownHtml : ''}
                ${title ? `<h2 style="margin-bottom: ${customization.popup.titleBottomMargin}px">${title}</h2>` : ''}
                ${imageInnerHtml}
                ${description ? `<p style="margin-bottom: ${customization.popup.descriptionBottomMargin}px">${description}</p>` : ''}
                ${countdown.active && countdown.position === 'belowText' ? countdownHtml : ''}
            </div>
        `;
    
        let finalPopupHtml = '';
        if (imageLayout === 'side') {
            finalPopupHtml = `
                <div class="custom-popup-body body-layout-side side-${imageSide}">
                    <div class="custom-popup-image-container" style="flex-basis: ${imageSideWidth}%;">${imageHtml}</div>
                    <div class="custom-popup-main-content" style="${popupStandardGap}">
                        ${textWrapperHtml}
                        ${buttonsHtml}
                    </div>
                </div>
            `;
        } else {
             finalPopupHtml = `
                <div class="custom-popup-body body-layout-default">
                    ${imageLayout === 'top' ? `<div class="custom-popup-image-container">${imageHtml}</div>` : ''}
                    <div class="custom-popup-main-content" style="${popupStandardGap}">
                        ${textWrapperHtml}
                        ${buttonsHtml}
                    </div>
                </div>
            `;
        }
    
        return `
            <div id="custom-popup" class="popup ${getPopupPositionClass()} ${getPopupAnimationClass()}" style="${popupStyles} ${getPopupContourStyle()}">
                ${closeButtonHtml('custom-popup')}
                ${finalPopupHtml}
            </div>
        `;
    })();
    
    const choicePopup = popups.choice.active ? `
        <div id="choice-popup" class="popup ${getPopupPositionClass()} ${getPopupAnimationClass()}" style="${popupStyles} ${getPopupContourStyle()}">
            ${closeButtonHtml('choice-popup')}
            <div class="popup-inner-content" style="${popupContentStyles} ${popupStandardGap}">
                <h2>${popups.choice.title}</h2>
                <p>${popups.choice.description}</p>
                <div class="choice-images">
                    <div class="choice-image-wrapper" onclick="proceed('choice-popup')">
                        <img src="${popups.choice.image1Url}" />
                    </div>
                    <div class="choice-image-wrapper" onclick="proceed('choice-popup')">
                        <img src="${popups.choice.image2Url}" />
                    </div>
                </div>
            </div>
        </div>
    ` : '';

    const captchaCheckbox = `
        <div class="captcha-box">
            <div class="captcha-checkbox-container">
                <input type="checkbox" id="captcha-checkbox" style="display:none;">
                <div class="captcha-checkbox-custom">
                    <div class="captcha-spinner"></div>
                    <svg class="captcha-checkmark" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
            </div>
            <label for="captcha-checkbox">Não sou um robô</label>
            <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA logo">
        </div>
    `;

    const captchaCheckboxV2 = `
        <div class="captcha-v2-container">
            <label class="captcha-v2-label">
                <input type="checkbox" class="captcha-v2-checkbox">
                <span class="captcha-v2-custom-checkbox">
                    <svg class="captcha-v2-checkmark" viewBox="0 0 24 24"><path d="M4.5 12.75l6 6 9-13.5"></path></svg>
                </span>
                <span class="captcha-v2-text">Eu não sou um robô</span>
            </label>
        </div>
    `;

     const captchaSlideV2 = `
        <div class="captcha-slide-v2-container" data-shape="${popups.captcha.sliderShape}">
            <input type="range" min="0" max="100" value="0" class="captcha-slide-v2-input" id="captcha-slider-v2">
            <label for="captcha-slider-v2" class="captcha-slide-v2-label">
                <span>${popups.captcha.sliderText}</span>
                <span>${popups.captcha.sliderSuccessText}</span>
            </label>
        </div>
    `;
    
    const captchaSlideV3 = `
        <div class="captcha-slide-v2-container captcha-slide-v3-container" data-shape="${popups.captcha.sliderShape}">
            <input type="range" min="0" max="100" value="0" class="captcha-slide-v2-input captcha-slide-v3-input" id="captcha-slider-v3">
            <label for="captcha-slider-v3" class="captcha-slide-v2-label captcha-slide-v3-label">
                <span>${popups.captcha.sliderText}</span>
                <span>${popups.captcha.sliderSuccessText}</span>
            </label>
        </div>
    `;

    const getCaptchaHtml = () => {
        switch (popups.captcha.captchaType) {
            case 'checkbox-v2': return captchaCheckboxV2;
            case 'slide-v2': return captchaSlideV2;
            case 'slide-v3': return captchaSlideV3;
            case 'checkbox':
            default: return captchaCheckbox;
        }
    };


    const captchaPopup = popups.captcha.active ? `
        <div id="captcha-popup" class="popup ${getPopupPositionClass()} ${getPopupAnimationClass()}" style="${popupStyles} ${getPopupContourStyle()}">
            ${closeButtonHtml('captcha-popup')}
            <div class="popup-inner-content" style="${popupContentStyles} ${popupStandardGap}">
                <h2>${popups.captcha.title}</h2>
                <p>${popups.captcha.description}</p>
                ${getCaptchaHtml()}
            </div>
        </div>
    ` : '';


    const exitPopup = popups.exit.active ? `
        <div id="exit-popup" class="popup popup-center ${getPopupAnimationClass()} ${popups.exit.imageOnly ? 'image-only-popup' : ''}" style="${popupStyles} ${getPopupContourStyle()}">
            ${closeButtonHtml('exit-popup')}
            ${popups.exit.imageOnly ? `
                <a href="${popups.exit.redirectLink || affiliateLink}" target="${newTab ? '_blank' : '_self'}" class="exit-image-link">
                    <img src="${popups.exit.imageUrl}" alt="Oferta de Saída" style="width:100%; height:100%; object-fit: cover; display:block;" />
                </a>
            ` : `
                <div style="padding:0; display: flex; flex-direction: column;">
                    <img src="${popups.exit.imageUrl}" alt="Oferta de Saída" style="width:100%; height:auto; display:block; border-top-left-radius: ${customization.popup.borderRadius}px; border-top-right-radius: ${customization.popup.borderRadius}px;" />
                    <div class="popup-inner-content" style="${popupContentStyles} ${popupStandardGap}">
                        <h3>Espere, não vá embora!</h3>
                        <p>Temos uma oferta especial para você.</p>
                        <div class="button-container" style="${buttonContainerStyle}">
                            <button style="${getButtonStyle(customization.button, true)}" onclick="redirect('${popups.exit.redirectLink || affiliateLink}', true)">Pegar Oferta</button>
                        </div>
                    </div>
                </div>
            `}
        </div>
    ` : '';

    const footerSection = footer.active ? `
        <footer style="background-color: ${footer.backgroundColor}; color: ${footer.textColor};">
            <a href="${footer.privacyLink}" style="color: ${footer.textColor};">Política de Privacidade</a>
            <span>|</span>
            <a href="${footer.termsLink}" style="color: ${footer.textColor};">Termos de Uso</a>
        </footer>
    ` : '';

    const disclaimerSection = disclaimer.active ? `
        <div class="disclaimer" style="background-color: ${disclaimer.backgroundColor}; color: ${disclaimer.textColor};">
            <p>${disclaimer.text}</p>
        </div>
    ` : '';
    
    const facebookPixelScript = tracking.facebookPixelId ? `
        <!-- Facebook Pixel Code -->
        <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${tracking.facebookPixelId}');
        fbq('track', 'PageView');
        </script>
        <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=${tracking.facebookPixelId}&ev=PageView&noscript=1"
        /></noscript>
        <!-- End Facebook Pixel Code -->
    ` : '';

    const googleAdsScript = tracking.googleAdsId ? `
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=${tracking.googleAdsId}"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${tracking.googleAdsId}');
        </script>
    ` : '';

    const pageTitle = seo?.title || 'Site Page';
    const pageDescription = seo?.description || 'Presell page description.';
    const favicon = seo?.favicon || 'https://i.imgur.com/ihAZlua.png';


    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${pageTitle}</title>
        <meta name="description" content="${pageDescription}">
        <link rel="icon" href="${favicon}">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        ${fontImportUrl ? `<link href="${fontImportUrl}" rel="stylesheet">` : ''}
        ${facebookPixelScript}
        ${googleAdsScript}
        <style>
            :root {
                --captcha-slider-button: ${popups.captcha.sliderButtonColor};
                --captcha-slider-track: ${popups.captcha.sliderTrackColor};
                --captcha-slider-text-color: ${popups.captcha.sliderTextColor};
                --captcha-slider-success-text-color: ${popups.captcha.sliderSuccessTextColor};
                --captcha-slider-success-bg: #28a745;
                --captcha-slider-radius: ${popups.captcha.sliderShape === 'round' ? '25px' : '4px'};
                --captcha-slider-thumb-radius: ${popups.captcha.sliderShape === 'round' ? '50%' : '4px'};
            }
            body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; overflow: hidden;}
            .main-wrapper {
                position: relative;
                width: 100vw;
                height: 100vh;
                overflow: hidden;
            }
            .main-section {
                cursor: pointer;
                background-size: cover;
                background-position: center;
                height: ${imageHeightDesktop}vh;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                transition: filter 0.3s ease-in-out;
            }
            .bg-desktop { ${getDesktopBgStyle()} }
            .bg-mobile { ${getMobileBgStyle()} display: none; }

            .disclaimer { padding: 8px; text-align: center; font-size: 12px; position: fixed; bottom: ${footer.active ? '49px' : '0'}; width: 100%; z-index: 10;}
            footer { padding: 16px; text-align: center; font-size: 14px; position: fixed; bottom: 0; width: 100%; z-index: 10;}
            footer a { color: inherit; text-decoration: none; margin: 0 8px; }
            
            .popup-wrapper {
                position: fixed;
                inset: 0;
                background-color: ${overlay.active ? `rgba(0,0,0,${overlay.opacity})` : 'transparent'};
                backdrop-filter: ${blur.active ? `blur(${blur.intensity}px)` : 'none'};
                -webkit-backdrop-filter: ${blur.active ? `blur(${blur.intensity}px)` : 'none'};
                z-index: 99;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
                pointer-events: auto;
            }
            
            .popup-wrapper {
                 display: none;
                 pointer-events: none;
            }

            .popup { 
                position: relative;
                z-index: 100;
                ${getPopupShadowStyle()}
                box-sizing: border-box; 
                animation-duration: ${customization.popupAnimationDuration}s; 
                animation-timing-function: ease-out; 
                animation-fill-mode: both;
                width: 100%;
                display: flex;
                flex-direction: column;
                max-height: 95vh;
                overflow: hidden;
                display: none; /* Popups are hidden by default */
            }
            .popup-center { margin: auto; }
            .popup-bottom { margin-top: auto; }
            .popup-top { margin-bottom: auto; }
            
            .popup-inner-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                overflow-y: auto;
                -ms-overflow-style: none;
                scrollbar-width: none;
                gap: ${customization.popup.gap}px;
            }

            .popup-inner-content::-webkit-scrollbar,
            .custom-popup-body::-webkit-scrollbar {
                display: none;
            }

            .icon-container {
                display: flex;
                justify-content: center;
                width: 100%;
            }

            .popup .close-button {
                position: absolute;
                top: 8px;
                right: 8px;
                background: transparent;
                border: none;
                font-size: 28px;
                font-weight: 300;
                line-height: 1;
                cursor: pointer;
                color: ${customization.closeButtonColor};
                opacity: 0.7;
                padding: 4px;
                z-index: 101;
            }
            .popup .close-button:hover {
                opacity: 1;
            }
            ${typographyStyles}
            .popup button { 
                padding: 12px 24px; font-size: 16px; font-weight: bold; cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                max-width: 100%;
                flex-shrink: 0;
                box-sizing: border-box;
            }
            .popup button:hover { transform: translateY(-2px); ${getButtonShadowStyle()} }
            
            .choice-images { display: flex; justify-content: center; gap: 20px; width: 100%; }
            .choice-image-wrapper { 
                flex: 1;
                max-width: ${popups.choice.customImageWidth}px;
                cursor: pointer;
                overflow: hidden;
                transition: transform 0.2s, box-shadow 0.2s;
                border: 2px solid transparent;
                aspect-ratio: 16 / 9;
                border-radius: 8px;
            }
            .choice-image-wrapper:hover { 
                transform: scale(1.05); 
                box-shadow: 0 8px 15px rgba(0,0,0,0.2); 
                border-color: ${customization.button.color}; 
            }
            .choice-image-wrapper img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }

            .custom-popup-body { display: flex; flex-direction: column; width: 100%; height: 100%; overflow-y: auto; }
            .custom-popup-main-content { display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; box-sizing: border-box; flex-grow: 1; padding: ${customization.popup.paddingY}px ${customization.popup.paddingX}px; }
            
            .custom-popup-image-container { overflow: hidden; flex-shrink: 0; }
            .custom-popup-image { width: 100%; height: auto; object-fit: cover; display: block; }
            .custom-popup-image-inner { margin: ${Math.floor(customization.popup.gap / 2)}px auto; border-radius: 8px; }
            
            .body-layout-side { flex-direction: row; align-items: stretch; }
            .body-layout-side.side-right { flex-direction: row-reverse; }
            .body-layout-side .custom-popup-image-container { flex-shrink: 0; }
            .body-layout-side .custom-popup-image { height: 100%; }
            .body-layout-side .custom-popup-main-content { flex: 1; justify-content: center; }
            .body-layout-side.side-left .custom-popup-image-container { border-top-left-radius: ${customization.popup.borderRadius}px; border-bottom-left-radius: ${customization.popup.borderRadius}px; }
            .body-layout-side.side-right .custom-popup-image-container { border-top-right-radius: ${customization.popup.borderRadius}px; border-bottom-right-radius: ${customization.popup.borderRadius}px; }
            
            .body-layout-default .custom-popup-image-container { border-top-left-radius: ${customization.popup.borderRadius}px; border-top-right-radius: ${customization.popup.borderRadius}px; }

            .text-wrapper { display: flex; flex-direction: column; width:100%; align-items: center; }

            .custom-popup-buttons { display: flex; width: 100%; gap: 10px; }
            .buttons-vertical { flex-direction: column; align-items: ${getButtonAlignment()}; }
            .buttons-horizontal { flex-direction: row; justify-content: center; }
            .buttons-horizontal button { flex: 1; }

            .countdown-container { text-align: center; font-size: var(--countdown-font-size); line-height: 1.2; }
            .countdown-style1 { font-weight: bold; color: var(--countdown-color); }
            .countdown-style2, .countdown-style3 { display: flex; gap: 8px; justify-content: center; color: var(--countdown-color); }
            .time-box { background-color: var(--countdown-box-color); padding: 0.5em; border-radius: 5px; }
            .countdown-style3 .time-box { border-radius: 50%; width: calc(var(--countdown-font-size) * 2.8); height: calc(var(--countdown-font-size) * 2.8); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0; line-height: 1; }
            .time-unit { font-size: 1.2em; font-weight: bold; }
            .time-label { font-size: 0.4em; text-transform: uppercase; opacity: 0.8; }
            
            .captcha-box { display: flex; align-items: center; justify-content: space-between; background-color: #f9f9f9; border: 1px solid #d3d3d3; padding: 15px; border-radius: 3px; }
            .captcha-box label { font-size: 14px; color: #000; cursor: pointer; user-select: none; flex-grow: 1; }
            .captcha-box img { width: 48px; height: 48px; }
            .captcha-checkbox-container { position: relative; width: 28px; height: 28px; margin-right: 12px; }
            .captcha-checkbox-custom { width: 28px; height: 28px; border: 2px solid #c1c1c1; border-radius: 2px; display: flex; align-items: center; justify-content: center; cursor: pointer; background-color: #fcfcfc; transition: background-color 0.2s; }
            .captcha-spinner { display: none; width: 20px; height: 20px; border: 3px solid rgba(0, 0, 0, 0.1); border-top-color: ${customization.button.color || '#3B82F6'}; border-radius: 50%; animation: spin 1s linear infinite; }
            .captcha-checkmark { display: none; color: ${customization.button.color || '#3B82F6'}; }
            .captcha-checkbox-custom.verifying .captcha-spinner { display: block; }
            .captcha-checkbox-custom.verified .captcha-spinner { display: none; }
            .captcha-checkbox-custom.verified .captcha-checkmark { display: block; animation: checkmark 0.3s ease-in-out; }
            .captcha-checkbox-custom.verified { background-color: #f4fce8; border-color: #adec63; }
            
            .captcha-v2-container { padding: 10px; border-radius: 4px; background-color: #f0f0f0; display: inline-flex; }
            .captcha-v2-label { display: flex; align-items: center; cursor: pointer; user-select: none; }
            .captcha-v2-checkbox { display: none; }
            .captcha-v2-custom-checkbox { width: 28px; height: 28px; border: 2px solid #ccc; border-radius: 4px; margin-right: 12px; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s, border-color 0.2s; }
            .captcha-v2-checkmark { stroke: white; stroke-width: 3; fill: none; width: 20px; height: 20px; transition: transform 0.2s; transform: scale(0); }
            .captcha-v2-text { font-size: 14px; }
            .captcha-v2-checkbox:checked + .captcha-v2-custom-checkbox { background-color: ${customization.button.color || '#3B82F6'}; border-color: ${customization.button.color || '#3B82F6'}; }
            .captcha-v2-checkbox:checked + .captcha-v2-custom-checkbox .captcha-v2-checkmark { transform: scale(1); }

            .captcha-slide-v2-container { position: relative; width: 100%; max-width: 300px; height: 50px; }
            .captcha-slide-v2-input { -webkit-appearance: none; appearance: none; width: 100%; height: 100%; background: var(--captcha-slider-track); border-radius: var(--captcha-slider-radius); outline: none; margin: 0; padding: 0; cursor: pointer; }
            .captcha-slide-v2-input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 50px; height: 50px; background: white; border: 2px solid #ccc; border-radius: var(--captcha-slider-thumb-radius); cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; justify-content: center; }
            .captcha-slide-v2-input:disabled { background: var(--captcha-slider-success-bg); }
            .captcha-slide-v2-input:disabled::-webkit-slider-thumb { background: var(--captcha-slider-success-bg); border-color: var(--captcha-slider-success-bg); }
            .captcha-slide-v2-label { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; color: var(--captcha-slider-text-color); }
            .captcha-slide-v2-label span:last-child { display: none; }
            .captcha-slide-v2-input:disabled + .captcha-slide-v2-label span:first-child { display: none; }
            .captcha-slide-v2-input:disabled + .captcha-slide-v2-label span:last-child { display: block; color: var(--captcha-slider-success-text-color); font-weight: bold; }
            
            .captcha-slide-v3-input::-webkit-slider-thumb { background: var(--captcha-slider-button); border: none; }
            .captcha-slide-v3-input:disabled { background: var(--captcha-slider-success-bg); }
            .captcha-slide-v3-input:disabled::-webkit-slider-thumb { background: var(--captcha-slider-success-bg); }
            .captcha-slide-v3-input:disabled + .captcha-slide-v3-label span:last-child { color: var(--captcha-slider-success-text-color); }
            
            .captcha-slide-v2-input::-webkit-slider-thumb::after {
                content: '→';
                font-size: 24px;
                color: #888;
                display: block;
            }
            .captcha-slide-v2-input:disabled::-webkit-slider-thumb::after {
                content: '✓';
                color: white;
            }
            .captcha-slide-v3-input::-webkit-slider-thumb {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: center;
            }
             .captcha-slide-v3-input:disabled::-webkit-slider-thumb {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
            }


            .image-only-popup { padding: 0 !important; background-color: transparent !important; border: none !important; }
            .image-only-popup .exit-image-link { display: block; width: 100%; height: 100%; }
            .image-only-popup img { border-radius: inherit; }
            
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes checkmark { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }

            .popup.popup-animation-fadeIn { animation-name: fadeIn; }
            .popup.popup-animation-slideInDown { animation-name: slideInDown; }
            .popup.popup-animation-slideInUp { animation-name: slideInUp; }
            .popup.popup-animation-zoomIn { animation-name: zoomIn; }

            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideInDown { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes slideInUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); } }

            @media (max-width: 768px) {
                .bg-desktop { display: none; }
                .bg-mobile { display: flex; height: ${imageHeightMobile}vh; }
                .popup-wrapper { align-items: center; }
                .popup { max-width: calc(100vw - 2rem); }
                .popup h2 { font-size: calc(${customization.typography.titleSize}px * 0.85); }
                .popup p { font-size: calc(${customization.typography.textSize}px * 0.95); }
                .popup button { padding: 12px 18px; font-size: 15px; }
                .choice-images { gap: 15px; }
                .body-layout-side, .body-layout-side.side-right { flex-direction: column; }
                .body-layout-side .custom-popup-image-container { flex-basis: auto; max-height: 40vh; }
                .body-layout-side .custom-popup-main-content { flex: 1; }
            }
        </style>
    </head>
    <body>
        <div class="main-wrapper">
             <div class="main-section bg-desktop" onclick="mainAction()"></div>
             <div class="main-section bg-mobile" onclick="mainAction()"></div>
            
            <div class="popup-wrapper">
                ${agePopup}
                ${captchaPopup}
                ${customPopup}
                ${choicePopup}
                ${discountPopup}
                ${cookiePopup}
                ${exitPopup}
            </div>
        </div>
        ${disclaimerSection}
        ${footerSection}
        ${customization.customHtml || ''}
        <script>
            const AFFILIATE_LINK = '${affiliateLink}';
            const NEW_TAB = ${newTab};
            const FULL_PAGE_CLICK = ${fullPageClick};
            
            const popupWrapper = document.querySelector('.popup-wrapper');
            const exitPopup = document.getElementById('exit-popup');
            
            const regularPopups = [];
            if (${popups.ageVerification.active}) regularPopups.push(document.getElementById('age-popup'));
            if (${popups.captcha.active}) regularPopups.push(document.getElementById('captcha-popup'));
            if (${popups.custom.active}) regularPopups.push(document.getElementById('custom-popup'));
            if (${popups.choice.active}) regularPopups.push(document.getElementById('choice-popup'));
            if (${popups.discount.active}) regularPopups.push(document.getElementById('discount-popup'));
            if (${popups.cookies.active}) regularPopups.push(document.getElementById('cookie-popup'));

            let currentPopupIndex = -1;
            let isPopupActive = false;
            let exitIntentFired = false;

            function showNextPopup() {
                if (isPopupActive) return;
                currentPopupIndex++;
                if (currentPopupIndex < regularPopups.length) {
                    const popup = regularPopups[currentPopupIndex];
                    if (popup) {
                        isPopupActive = true;
                        popupWrapper.style.display = 'flex';
                        popupWrapper.style.pointerEvents = 'auto';
                        popup.style.display = 'flex';
                    } else {
                        showNextPopup();
                    }
                } else {
                    isPopupActive = false;
                    popupWrapper.style.display = 'none';
                    popupWrapper.style.pointerEvents = 'none';
                    if (AFFILIATE_LINK) {
                        redirect(AFFILIATE_LINK);
                    }
                }
            }
            
            function proceed(popupId) {
                const popup = document.getElementById(popupId);
                if (popup) {
                    popup.style.display = 'none';
                }
                isPopupActive = false;
                showNextPopup();
            }

            function closePopup(popupId, event) {
                if (event) event.stopPropagation();
                redirect(AFFILIATE_LINK);
            }

            function redirect(url, forceNewTab = false) {
                if (!url || url === '#') return;
                const target = (NEW_TAB || forceNewTab) ? '_blank' : '_self';
                window.open(url, target);
            }

            function mainAction() {
                if (FULL_PAGE_CLICK) {
                    redirect(AFFILIATE_LINK);
                    return;
                }
                 if (regularPopups.length === 0 && !exitPopup) {
                    redirect(AFFILIATE_LINK);
                }
            }
            
            window.addEventListener('load', () => {
                if (regularPopups.length > 0) {
                    showNextPopup();
                }
            });


            ${popups.custom.countdown.active ? `
                (function() {
                    const countdownEl = document.getElementById('custom-countdown');
                    if (!countdownEl) return;

                    const timeString = "${popups.custom.countdown.time}";
                    const parts = timeString.split(':').map(Number);
                    if (parts.length !== 3) return;

                    let totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];

                    function updateCountdown() {
                        if (totalSeconds < 0) {
                            clearInterval(interval);
                            countdownEl.innerHTML = "Oferta expirada!";
                            return;
                        }

                        const hours = Math.floor(totalSeconds / 3600);
                        const minutes = Math.floor((totalSeconds % 3600) / 60);
                        const seconds = totalSeconds % 60;

                        const format = (n) => n.toString().padStart(2, '0');
                        const style = "${popups.custom.countdown.style}";

                        const hoursLabel = style === 'style3' ? 'Hrs' : 'Horas';
                        const minutesLabel = style === 'style3' ? 'Min' : 'Minutos';
                        const secondsLabel = style === 'style3' ? 'Seg' : 'Segundos';


                        if (style === "style1") {
                            countdownEl.innerHTML = \`\${format(hours)}:\${format(minutes)}:\${format(seconds)}\`;
                        } else {
                            countdownEl.innerHTML = \`
                                <div class="time-box"><div class="time-unit">\${format(hours)}</div><div class="time-label">\${hoursLabel}</div></div>
                                <div class="time-box"><div class="time-unit">\${format(minutes)}</div><div class="time-label">\${minutesLabel}</div></div>
                                <div class="time-box"><div class="time-unit">\${format(seconds)}</div><div class="time-label">\${secondsLabel}</div></div>
                            \`;
                        }
                        
                        totalSeconds--;
                    }

                    updateCountdown();
                    const interval = setInterval(updateCountdown, 1000);
                })();
            ` : ''}

            function initializeCaptchas() {
                const captchaType = "${popups.captcha.captchaType}";
                if (!${popups.captcha.active}) return;

                if (captchaType.startsWith('checkbox')) {
                    let captchaBox, isVerifying = false, checkbox, customCheckbox;
                    
                    if (captchaType === "checkbox") {
                         captchaBox = document.querySelector('.captcha-box');
                         if (!captchaBox) return;
                         customCheckbox = captchaBox.querySelector('.captcha-checkbox-custom');
                    } else if (captchaType === "checkbox-v2") {
                         captchaBox = document.querySelector('.captcha-v2-container');
                         if (!captchaBox) return;
                         checkbox = captchaBox.querySelector('.captcha-v2-checkbox');
                    }

                    if (!captchaBox) return;
                    
                    const handleCaptchaClick = () => {
                        if (isVerifying) return;
                        
                        if (captchaType === "checkbox") {
                            if (customCheckbox.classList.contains('verified')) return;
                            isVerifying = true;
                            customCheckbox.classList.add('verifying');
                            setTimeout(() => {
                                customCheckbox.classList.remove('verifying');
                                customCheckbox.classList.add('verified');
                                setTimeout(() => proceed('captcha-popup'), 400);
                            }, 1200);
                        } else if (captchaType === "checkbox-v2") {
                            if(checkbox.checked) return;
                            isVerifying = true;
                            setTimeout(() => {
                                checkbox.checked = true;
                                isVerifying = false;
                                setTimeout(() => proceed('captcha-popup'), 400);
                            }, 500);
                        }
                    };
                    captchaBox.addEventListener('click', handleCaptchaClick);
                }

                if (captchaType.startsWith('slide')) {
                    if (captchaType === 'slide-v2' || captchaType === 'slide-v3') {
                         const sliderId = captchaType === 'slide-v2' ? 'captcha-slider-v2' : 'captcha-slider-v3';
                         const slider = document.getElementById(sliderId);
                         if (!slider) return;
                         
                         slider.addEventListener('input', () => {
                            if (slider.value > 95) {
                                slider.value = 100;
                                slider.disabled = true;
                                setTimeout(() => proceed('captcha-popup'), 400);
                            }
                         });
                         const releaseHandler = () => {
                            if (!slider.disabled && slider.value < 100) {
                                slider.value = 0;
                            }
                         };
                         slider.addEventListener('mouseup', releaseHandler);
                         slider.addEventListener('touchend', releaseHandler);
                    }
                }
            }
            
            initializeCaptchas();

            ${autoRedirect.active ? `setTimeout(() => { if (AFFILIATE_LINK) redirect(AFFILIATE_LINK); }, ${autoRedirect.time * 1000});` : ''}

            ${popups.exit.active ? `
                document.addEventListener('mouseleave', function(e) {
                    if (e.clientY < 0 && !isPopupActive && !exitIntentFired) {
                        if (exitPopup) {
                            exitIntentFired = true;
                            isPopupActive = true;
                            popupWrapper.style.display = 'flex';
                            popupWrapper.style.pointerEvents = 'auto';
                            exitPopup.style.display = 'flex';
                        }
                    }
                });
            ` : ''}
        </script>
    </body>
    </html>`;
};
