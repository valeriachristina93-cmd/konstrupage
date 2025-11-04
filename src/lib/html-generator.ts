

import type { PageConfig } from './definitions';
import { fontOptions } from './constants';

export const generatePresellHtml = (config: PageConfig) => {
    const { 
        desktopImage, mobileImage, imageHeightDesktop, imageHeightMobile, affiliateLink, autoRedirect, newTab, fullPageClick,
        popups, footer, disclaimer, overlay, blur, tracking, customization
    } = config;

    const anyPopupActive = popups.cookies.active || popups.ageVerification.active || popups.discount.active || popups.custom.active || popups.choice.active || popups.captcha.active;

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
        .popup h3, .popup h2 { color: ${customization.typography.titleColor}; font-size: ${customization.typography.titleSize}px; margin: 0; }
        .popup p { color: ${customization.typography.textColor}; font-size: ${customization.typography.textSize}px; margin: 0; }
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

    const buttonStyle = `background-color: ${customization.button.color}; color: ${customization.button.textColor}; width: ${customization.button.width}%; border-radius: ${customization.button.borderRadius}px;`;
    
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
                    <button style="${buttonStyle}" onclick="acceptAction()">${popups.cookies.buttonText}</button>
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
                    <button style="background-color: ${popups.ageVerification.yesButtonColor}; color: ${isColorLight(popups.ageVerification.yesButtonColor) ? '#000' : '#fff'}; width: ${popups.ageVerification.buttonWidth}%; border-radius: ${customization.button.borderRadius}px;" onclick="acceptAction()">${popups.ageVerification.yesButtonText}</button>
                    <button style="background-color: ${popups.ageVerification.noButtonColor}; color: ${isColorLight(popups.ageVerification.noButtonColor) ? '#000' : '#fff'}; width: ${popups.ageVerification.buttonWidth}%; border-radius: ${customization.button.borderRadius}px;" onclick="window.history.back()">${popups.ageVerification.noButtonText}</button>
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
                    <button style="${buttonStyle}" onclick="acceptAction()">Aproveitar Agora</button>
                </div>
            </div>
        </div>
    ` : '';

    const customPopup = (() => {
        if (!popups.custom.active) return '';
    
        const { title, description, buttonText, imageUrl, imageLayout, imageSide, imageInternalWidth, secondButton, buttonsAlignment, countdown } = popups.custom;
    
        const countdownHtml = countdown.active ? `
            <div id="custom-countdown" class="countdown-container ${'countdown-' + countdown.style}" style="--countdown-color: ${countdown.color}; --countdown-font-size: ${countdown.fontSize}px; --countdown-box-color: ${countdown.boxColor};">
            </div>
        ` : '';

        const imageHtml = imageUrl && imageLayout !== 'none' 
            ? `<img src="${imageUrl}" class="custom-popup-image" alt="Pop-up Image" style="${imageLayout === 'inner' ? `width: ${imageInternalWidth}%;` : ''}">` 
            : '';
    
        const mainButtonHtml = `<button style="${buttonStyle}" onclick="redirect('${affiliateLink}')">${buttonText}</button>`;
        const secondButtonHtml = secondButton.active ? `<button style="${buttonStyle}" onclick="redirect('${secondButton.link}')">${secondButton.text}</button>` : '';
        
        const buttonsContainerClass = buttonsAlignment === 'horizontal' ? 'buttons-horizontal' : 'buttons-vertical';
        const buttonsHtml = `<div class="custom-popup-buttons ${buttonsContainerClass}">${mainButtonHtml}${secondButtonHtml}</div>`;
    
        const textWrapperHtml = `
            <div class="text-wrapper">
                ${countdown.active && countdown.position === 'aboveTitle' ? countdownHtml : ''}
                ${title ? `<h2>${title}</h2>` : ''}
                ${imageLayout === 'inner' ? imageHtml : ''}
                ${description ? `<p>${description}</p>` : ''}
                ${countdown.active && countdown.position === 'belowText' ? countdownHtml : ''}
            </div>
        `;
    
        let finalPopupHtml = '';
        if (imageLayout === 'side') {
            finalPopupHtml = `
                <div class="custom-popup-body body-layout-side side-${imageSide}">
                    <div class="custom-popup-image-container">${imageHtml}</div>
                    <div class="custom-popup-main-content">
                        ${textWrapperHtml}
                        ${buttonsHtml}
                    </div>
                </div>
            `;
        } else {
             finalPopupHtml = `
                <div class="custom-popup-body body-layout-default">
                    ${imageLayout === 'top' ? `<div class="custom-popup-image-container">${imageHtml}</div>` : ''}
                    <div class="custom-popup-main-content">
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
                    <div class="choice-image-wrapper" onclick="acceptAction()">
                        <img src="${popups.choice.image1Url}" />
                    </div>
                    <div class="choice-image-wrapper" onclick="acceptAction()">
                        <img src="${popups.choice.image2Url}" />
                    </div>
                </div>
            </div>
        </div>
    ` : '';

    const captchaCheckbox = `
        <div class="captcha-box">
            <div class="captcha-checkbox-container">
                <input type="checkbox" id="captcha-checkbox" onclick="handleCaptchaCheckbox()">
                <div class="captcha-checkbox-custom">
                    <div class="captcha-spinner"></div>
                    <svg class="captcha-checkmark" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
            </div>
            <label for="captcha-checkbox">Não sou um robô</label>
            <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA logo">
        </div>
    `;

    const captchaSlide = `
        <div class="captcha-slide-container">
            <div class="captcha-slide-track">
                <div class="captcha-slide-thumb">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
                <span class="captcha-slide-text">Deslize para continuar</span>
            </div>
        </div>
    `;

    const captchaPopup = popups.captcha.active ? `
        <div id="captcha-popup" class="popup ${getPopupPositionClass()} ${getPopupAnimationClass()}" style="${popupStyles} ${getPopupContourStyle()}">
            ${closeButtonHtml('captcha-popup')}
            <div class="popup-inner-content" style="${popupContentStyles} ${popupStandardGap}">
                <h2>${popups.captcha.title}</h2>
                <p>${popups.captcha.description}</p>
                ${popups.captcha.captchaType === 'slide' ? captchaSlide : captchaCheckbox}
            </div>
        </div>
    ` : '';


    const exitPopup = popups.exit.active ? `
        <div id="exit-popup-overlay" style="display:none;">
            <div id="exit-popup" class="popup popup-center" style="${popupStyles} ${getPopupContourStyle()}">
                ${closeButtonHtml('exit-popup')}
                <div style="padding:0; display: flex; flex-direction: column;">
                    <img src="${popups.exit.imageUrl}" alt="Oferta de Saída" style="width:100%; height:auto; display:block; border-top-left-radius: ${customization.popup.borderRadius}px; border-top-right-radius: ${customization.popup.borderRadius}px;" />
                    <div class="popup-inner-content" style="${popupContentStyles} ${popupStandardGap}">
                        <h3>Espere, não vá embora!</h3>
                        <p>Temos uma oferta especial para você.</p>
                        <div class="button-container" style="${buttonContainerStyle}">
                            <button style="${buttonStyle}" onclick="redirect('${popups.exit.redirectLink || affiliateLink}', true)">Pegar Oferta</button>
                        </div>
                    </div>
                </div>
            </div>
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

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Presell Page</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        ${fontImportUrl ? `<link href="${fontImportUrl}" rel="stylesheet">` : ''}
        ${facebookPixelScript}
        ${googleAdsScript}
        <style>
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
            
            #exit-popup-overlay, .popup-wrapper {
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
                 display: ${anyPopupActive ? 'flex' : 'none'};
                 pointer-events: ${anyPopupActive ? 'auto' : 'none'};
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
                 gap: 16px;
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
                border: none; padding: 12px 24px; font-size: 16px; font-weight: bold; cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                max-width: 100%;
                flex-shrink: 0;
            }
            .popup button:hover { transform: translateY(-2px); ${getButtonShadowStyle()} }
            
            .choice-images { display: flex; justify-content: center; gap: 20px; width: 100%; }
            .choice-image-wrapper { 
                width: ${popups.choice.customImageWidth}px;
                cursor: pointer;
                border-radius: 8px;
                overflow: hidden;
                transition: transform 0.2s, box-shadow 0.2s;
                border: 2px solid transparent;
                position: relative;
                padding-top: 56.25%; /* 16:9 Aspect Ratio */
            }
            .choice-image-wrapper:hover { 
                transform: scale(1.05); 
                box-shadow: 0 8px 15px rgba(0,0,0,0.2); 
                border-color: ${customization.button.color}; 
            }
            .choice-image-wrapper img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .custom-popup-body { display: flex; flex-direction: column; width: 100%; height: 100%; overflow-y: auto; }
            .custom-popup-main-content { display: flex; flex-direction: column; align-items: center; text-align: center; gap: ${customization.popup.gap}px; padding: ${customization.popup.paddingY}px ${customization.popup.paddingX}px; width: 100%; box-sizing: border-box; flex-grow: 1; }
            
            .custom-popup-image-container { overflow: hidden; flex-shrink: 0; }
            .custom-popup-image { width: 100%; height: auto; object-fit: cover; display: block; }

            .text-wrapper .custom-popup-image {
                margin: ${Math.floor(customization.popup.gap / 2)}px auto;
                border-radius: 8px;
            }
            
            .body-layout-side { flex-direction: row; align-items: stretch; }
            .body-layout-side.side-right { flex-direction: row-reverse; }
            .body-layout-side .custom-popup-image-container { flex-basis: 40%; }
            .body-layout-side .custom-popup-image { height: 100%; }
            .body-layout-side .custom-popup-main-content { flex: 1; justify-content: center; }
            .body-layout-side.side-left .custom-popup-image-container { border-top-left-radius: ${customization.popup.borderRadius}px; border-bottom-left-radius: ${customization.popup.borderRadius}px; }
            .body-layout-side.side-right .custom-popup-image-container { border-top-right-radius: ${customization.popup.borderRadius}px; border-bottom-right-radius: ${customization.popup.borderRadius}px; }
            
            .body-layout-default .custom-popup-image-container { border-top-left-radius: ${customization.popup.borderRadius}px; border-top-right-radius: ${customization.popup.borderRadius}px; }

            .text-wrapper { display: flex; flex-direction: column; gap: ${Math.floor(customization.popup.gap / 2)}px; width:100%; align-items: center; }

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
            .time-label { font-size: 0.6em; text-transform: uppercase; opacity: 0.8; }
            
            .captcha-box { display: flex; align-items: center; justify-content: space-between; background-color: #f9f9f9; border: 1px solid #d3d3d3; padding: 15px; border-radius: 3px; }
            .captcha-box label { font-size: 14px; color: #000; cursor: pointer; user-select: none; flex-grow: 1; }
            .captcha-box img { width: 48px; height: 48px; }
            .captcha-checkbox-container { position: relative; width: 28px; height: 28px; margin-right: 12px; }
            .captcha-checkbox-custom { width: 28px; height: 28px; border: 2px solid #c1c1c1; border-radius: 2px; display: flex; align-items: center; justify-content: center; cursor: pointer; background-color: #f9f9f9; transition: background-color 0.2s; }
            #captcha-checkbox { opacity: 0; position: absolute; width: 100%; height: 100%; cursor: pointer; }
            .captcha-spinner { display: none; width: 20px; height: 20px; border: 3px solid rgba(0, 0, 0, 0.1); border-top-color: ${customization.button.color || '#3B82F6'}; border-radius: 50%; animation: spin 1s linear infinite; }
            .captcha-checkmark { display: none; color: ${customization.button.color || '#3B82F6'}; }
            #captcha-checkbox:checked + .captcha-checkbox-custom .captcha-spinner { display: none; }
            #captcha-checkbox:checked + .captcha-checkbox-custom .captcha-checkmark { display: block; animation: checkmark 0.3s ease-in-out; }
            #captcha-checkbox:checked + .captcha-checkbox-custom { background-color: #f4fce8; border-color: #adec63; }
            
            .captcha-slide-container {
                width: 100%;
                max-width: 300px;
                margin-left: auto;
                margin-right: auto;
            }
            .captcha-slide-track {
                width: 100%;
                height: 50px;
                background-color: #f0f0f0;
                border-radius: 25px;
                position: relative;
                overflow: hidden;
                border: 1px solid #e0e0e0;
                display: flex;
                align-items: center;
                justify-content: center;
                user-select: none;
            }
            .captcha-slide-thumb {
                width: 46px;
                height: 46px;
                background-color: white;
                border: 1px solid #ccc;
                border-radius: 50%;
                position: absolute;
                left: 2px;
                top: 2px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .captcha-slide-thumb svg { color: #666; }
            .captcha-slide-text {
                color: #aaa;
                font-size: 14px;
                z-index: 1;
                pointer-events: none;
            }
            .captcha-slide-track.verified { background-color: #D4EDDA; border-color: #C3E6CB; }
            .captcha-slide-track.verified .captcha-slide-text { display: none; }
            .captcha-slide-track.verified .captcha-slide-thumb {
                background-color: #28A745;
                border-color: #28A745;
                cursor: default;
            }
             .captcha-slide-track.verified .captcha-slide-thumb svg {
                stroke: white;
                animation: checkmark 0.3s ease-in-out;
            }
            
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes checkmark {
                0% { transform: scale(0); }
                70% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }

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

                .popup {
                    max-width: calc(100vw - 2rem);
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .popup h2 { font-size: calc(${customization.typography.titleSize}px * 0.85); }
                .popup p { font-size: calc(${customization.typography.textSize}px * 0.95); }
                .popup button { padding: 12px 18px; font-size: 15px; }
                .choice-images { flex-direction: row; gap: 15px;}
                .body-layout-side, .body-layout-side.side-right { flex-direction: column; }
                .body-layout-side .custom-popup-image-container { flex-basis: auto; max-height: 40vh; }
                .body-layout-side .custom-popup-main-content { flex: 1; padding-top: ${customization.popup.paddingX}px; padding-bottom: ${customization.popup.paddingY}px; }
            }
        </style>
    </head>
    <body>
        <div class="main-wrapper">
             <div class="main-section bg-desktop" onclick="mainAction()"></div>
             <div class="main-section bg-mobile" onclick="mainAction()"></div>
            
            <div class="popup-wrapper">
                ${cookiePopup}
                ${agePopup}
                ${discountPopup}
                ${customPopup}
                ${choicePopup}
                ${captchaPopup}
            </div>
        </div>

        ${exitPopup}
        ${disclaimerSection}
        ${footerSection}
        ${customization.customHtml || ''}
        <script>
            const AFFILIATE_LINK = '${affiliateLink}';
            const NEW_TAB = ${newTab};
            const FULL_PAGE_CLICK = ${fullPageClick};
            const popupsActive = ${anyPopupActive};

            function closePopup(popupId, event) {
                if (event) event.stopPropagation();
                
                if (popupId === 'exit-popup') {
                    const overlay = document.getElementById('exit-popup-overlay');
                    if(overlay) overlay.style.display = 'none';
                } else {
                    const popup = document.getElementById(popupId);
                    if (popup) {
                        popup.style.display = 'none';
                        const wrapper = document.querySelector('.popup-wrapper');
                        
                        const anyOtherPopupVisible = Array.from(wrapper.querySelectorAll('.popup')).some(p => p.id !== popupId && window.getComputedStyle(p).display !== 'none');

                        if (!anyOtherPopupVisible) {
                            wrapper.style.display = 'none';
                        }
                    }
                }
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
                if (!popupsActive) {
                    redirect(AFFILIATE_LINK);
                }
            }

            function acceptAction() {
                redirect(AFFILIATE_LINK);
            }

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

                        if ("${popups.custom.countdown.style}" === "style1") {
                            countdownEl.innerHTML = \`\${format(hours)}:\${format(minutes)}:\${format(seconds)}\`;
                        } else {
                            countdownEl.innerHTML = \`
                                <div class="time-box"><div class="time-unit">\${format(hours)}</div><div class="time-label">Horas</div></div>
                                <div class="time-box"><div class="time-unit">\${format(minutes)}</div><div class="time-label">Minutos</div></div>
                                <div class="time-box"><div class="time-unit">\${format(seconds)}</div><div class="time-label">Segundos</div></div>
                            \`;
                        }
                        
                        totalSeconds--;
                    }

                    updateCountdown();
                    const interval = setInterval(updateCountdown, 1000);
                })();
            ` : ''}

             function handleCaptchaCheckbox() {
                const checkbox = document.getElementById('captcha-checkbox');
                const customBox = checkbox.nextElementSibling;
                const spinner = customBox.querySelector('.captcha-spinner');
                
                if (checkbox.checked) {
                    spinner.style.display = 'block';
                    checkbox.disabled = true;
                    setTimeout(() => {
                        spinner.style.display = 'none';
                        customBox.querySelector('.captcha-checkmark').style.display = 'block';
                        setTimeout(() => {
                           acceptAction();
                        }, 400);
                    }, 1000);
                }
            }

            ${popups.captcha.active && popups.captcha.captchaType === 'slide' ? `
                const thumb = document.querySelector('.captcha-slide-thumb');
                const track = document.querySelector('.captcha-slide-track');
                const container = document.querySelector('.captcha-slide-container');
                let isDragging = false;
                let startX = 0;
                let offsetX = 0;

                if (thumb && track && container) {
                    const maxSlide = track.offsetWidth - thumb.offsetWidth - 4;

                    const onDragStart = (e) => {
                        if (track.classList.contains('verified')) return;
                        isDragging = true;
                        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                        thumb.style.transition = 'none';
                        track.style.transition = 'none';
                    };

                    const onDragMove = (e) => {
                        if (!isDragging) return;
                        e.preventDefault();
                        const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                        offsetX = Math.max(0, Math.min(currentX - startX, maxSlide));
                        thumb.style.transform = \\\`translateX(\\\${offsetX}px)\\\`;
                    };

                    const onDragEnd = () => {
                        if (!isDragging) return;
                        isDragging = false;
                        if (offsetX >= maxSlide - 2) {
                            thumb.style.transform = \\\`translateX(\\\${maxSlide}px)\\\`;
                            track.classList.add('verified');
                            thumb.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                            setTimeout(() => {
                                acceptAction();
                            }, 500);
                        } else {
                            thumb.style.transition = 'transform 0.3s ease';
                            thumb.style.transform = 'translateX(0)';
                        }
                    };
                    
                    thumb.addEventListener('mousedown', onDragStart);
                    document.addEventListener('mousemove', onDragMove);
                    document.addEventListener('mouseup', onDragEnd);
                    
                    thumb.addEventListener('touchstart', onDragStart, { passive: false });
                    document.addEventListener('touchmove', onDragMove, { passive: false });
                    document.addEventListener('touchend', onDragEnd);
                }
            ` : ''}
            
            ${autoRedirect.active ? `setTimeout(() => { if (AFFILIATE_LINK) redirect(AFFILIATE_LINK); }, ${autoRedirect.time * 1000});` : ''}

            ${popups.exit.active ? `
                let exitIntentFired = false;
                document.addEventListener('mouseleave', function(e) {
                    if (e.clientY < 0 && !exitIntentFired) {
                        const exitOverlay = document.getElementById('exit-popup-overlay');
                        if (exitOverlay) {
                             exitOverlay.style.display = 'flex';
                        }
                        exitIntentFired = true;
                    }
                });
                const exitOverlay = document.getElementById('exit-popup-overlay');
                if(exitOverlay) {
                    exitOverlay.addEventListener('click', function(e) {
                         if (e.target === this) {
                            this.style.display = 'none';
                        }
                    });
                }
            ` : ''}
        </script>
    </body>
    </html>`;
};

    
