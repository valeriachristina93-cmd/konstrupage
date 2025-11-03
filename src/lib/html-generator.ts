

import type { PageConfig } from './definitions';

export const generatePresellHtml = (config: PageConfig) => {
    const { 
        desktopImage, mobileImage, imageHeightDesktop, imageHeightMobile, affiliateLink, autoRedirect, newTab,
        popups, footer, disclaimer, overlay, blur, customization
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

    const typographyStyles = `
        .popup h3, .popup h2 { color: ${customization.typography.titleColor}; font-size: ${customization.typography.titleSize}px; }
        .popup p { color: ${customization.typography.textColor}; font-size: ${customization.typography.textSize}px; }
    `;

    const popupStyles = `background-color: ${customization.popupColor};`;
    
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
    
    const cookiePopup = popups.cookies.active ? `
        <div id="cookie-popup" class="popup ${getPopupPositionClass()} ${getPopupAnimationClass()}" style="${popupStyles} ${getPopupContourStyle()}">
            ${closeButtonHtml('cookie-popup')}
            <div class="popup-content">
                <h3>Políticas de Cookies</h3>
                <p>${popups.cookies.message}</p>
                <div class="button-container" style="${buttonContainerStyle}">
                    <button style="${buttonStyle}" onclick="acceptAction()">${popups.cookies.buttonText}</button>
                </div>
            </div>
        </div>
    ` : '';
    
    const agePopup = popups.ageVerification.active ? `
        <div id="age-popup" class="popup popup-bottom ${getPopupAnimationClass()}" style="${popupStyles} ${getPopupContourStyle()}">
             ${closeButtonHtml('age-popup')}
             <div class="popup-content">
                <p>${popups.ageVerification.message}</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button style="background-color: ${popups.ageVerification.yesButtonColor}; color: ${isColorLight(popups.ageVerification.yesButtonColor) ? '#000' : '#fff'}; width: ${popups.ageVerification.buttonWidth}%; border-radius: ${customization.button.borderRadius}px;" onclick="acceptAction()">${popups.ageVerification.yesButtonText}</button>
                    <button style="background-color: ${popups.ageVerification.noButtonColor}; color: ${isColorLight(popups.ageVerification.noButtonColor) ? '#000' : '#fff'}; width: ${popups.ageVerification.buttonWidth}%; border-radius: ${customization.button.borderRadius}px;" onclick="window.history.back()">${popups.ageVerification.noButtonText}</button>
                </div>
            </div>
        </div>
    ` : '';

    const discountPopup = popups.discount.active ? `
         <div id="discount-popup" class="popup popup-center ${getPopupAnimationClass()}" style="${popupStyles} ${getPopupContourStyle()}">
             ${closeButtonHtml('discount-popup')}
             <div class="popup-content">
                ${popups.discount.icon ? `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:${customization.button.color};"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><circle cx="12" cy="12" r="4"></circle></svg>` : ''}
                <h2>${popups.discount.text}</h2>
                <p>${popups.discount.description}</p>
                <div class="button-container" style="${buttonContainerStyle}">
                    <button style="${buttonStyle}" onclick="acceptAction()">Aproveitar Agora</button>
                </div>
            </div>
        </div>
    ` : '';

    const customPopup = popups.custom.active ? `
        <div id="custom-popup" class="popup ${getPopupPositionClass()} ${getPopupAnimationClass()}" style="${popupStyles} ${getPopupContourStyle()}">
            ${closeButtonHtml('custom-popup')}
            <div class="popup-content">
                <h2>${popups.custom.title}</h2>
                <p>${popups.custom.description}</p>
                <div class="button-container" style="${buttonContainerStyle}">
                    <button style="${buttonStyle}" onclick="acceptAction()">${popups.custom.buttonText}</button>
                </div>
            </div>
        </div>
    ` : '';
    
    const choicePopup = popups.choice.active ? `
        <div id="choice-popup" class="popup popup-center ${getPopupAnimationClass()}" style="${popupStyles} ${getPopupContourStyle()}">
            ${closeButtonHtml('choice-popup')}
            <div class="popup-content">
                <h2>${popups.choice.title}</h2>
                <p>${popups.choice.description}</p>
                <div class="choice-images">
                    <img src="${popups.choice.image1Url}" onclick="acceptAction()" style="width: ${popups.choice.customImageWidth}px;" />
                    <img src="${popups.choice.image2Url}" onclick="acceptAction()" style="width: ${popups.choice.customImageWidth}px;" />
                </div>
            </div>
        </div>
    ` : '';

    const captchaPopup = popups.captcha.active ? `
        <div id="captcha-popup" class="popup popup-center ${getPopupAnimationClass()}" style="${popupStyles} ${getPopupContourStyle()}">
            ${closeButtonHtml('captcha-popup')}
            <div class="popup-content">
                <h2>${popups.captcha.title}</h2>
                <p>${popups.captcha.description}</p>
                <div class="captcha-box">
                    <input type="checkbox" id="captcha-checkbox" onclick="acceptAction()">
                    <label for="captcha-checkbox">Não sou um robô</label>
                    <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA logo">
                </div>
            </div>
        </div>
    ` : '';


    const exitPopup = popups.exit.active ? `
        <div id="exit-popup" class="popup popup-center" style="display:none; ${popupStyles} ${getPopupContourStyle()}">
             ${closeButtonHtml('exit-popup')}
             <div class="popup-content" style="padding:0; max-width: 600px;">
                <img src="${popups.exit.imageUrl}" alt="Oferta de Saída" style="width:100%; height:auto; display:block; border-radius: 8px 8px 0 0;" />
                <div style="padding: 24px;">
                    <h3>Espere, não vá embora!</h3>
                    <p>Temos uma oferta especial para você.</p>
                     <div class="button-container" style="${buttonContainerStyle}">
                        <button style="${buttonStyle}" onclick="redirect('${popups.exit.redirectLink || affiliateLink}', true)">Pegar Oferta</button>
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
    
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Presell Page</title>
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

            .overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); }
            .disclaimer { padding: 8px; text-align: center; font-size: 12px; position: fixed; bottom: ${footer.active ? '49px' : '0'}; width: 100%; z-index: 10;}
            footer { padding: 16px; text-align: center; font-size: 14px; position: fixed; bottom: 0; width: 100%; z-index: 10;}
            footer a { color: inherit; text-decoration: none; margin: 0 8px; }
            .popup-wrapper {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: ${anyPopupActive && overlay.active ? `rgba(0,0,0,${overlay.opacity})` : 'transparent'};
                backdrop-filter: ${anyPopupActive && blur.active ? `blur(${blur.intensity}px)` : 'none'};
                -webkit-backdrop-filter: ${anyPopupActive && blur.active ? `blur(${blur.intensity}px)` : 'none'};
                z-index: 99;
                display: ${anyPopupActive ? 'block' : 'none'};
                pointer-events: ${anyPopupActive ? 'auto' : 'none'};
            }
            .popup { 
                position: fixed; 
                z-index: 100; 
                ${getPopupShadowStyle()}
                border-radius: 8px; 
                box-sizing: border-box; 
                animation-duration: ${customization.popupAnimationDuration}s; 
                animation-timing-function: ease-out; 
                animation-fill-mode: both; 
            }
            .popup-center { top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 500px; }
            .popup-bottom { bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 800px; }
            .popup-content { padding: 24px; text-align: center; }
            .popup .close-button {
                position: absolute;
                top: 10px;
                right: 10px;
                background: transparent;
                border: none;
                font-size: 24px;
                line-height: 1;
                cursor: pointer;
                color: inherit;
                padding: 5px;
            }
            .popup h3 { margin-top: 0; font-weight: bold; }
            .popup h2 { margin-top: 0; font-weight: bold; }
            .popup p { margin-bottom: 20px; line-height: 1.5; }
            ${typographyStyles}
            .popup button { 
                border: none; padding: 12px 24px; font-size: 16px; font-weight: bold; cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                max-width: 100%;
            }
            .popup button:hover { transform: translateY(-2px); ${getButtonShadowStyle()} }
            .choice-images { display: flex; justify-content: center; gap: 20px; }
            .choice-images img { height: auto; cursor: pointer; border-radius: 8px; transition: transform 0.2s, box-shadow 0.2s; border: 2px solid transparent; }
            .choice-images img:hover { transform: scale(1.05); box-shadow: 0 8px 15px rgba(0,0,0,0.2); border-color: ${customization.button.color}; }
            .captcha-box { display: flex; align-items: center; justify-content: space-between; background-color: #f9f9f9; border: 1px solid #d3d3d3; padding: 15px; border-radius: 3px; margin-top: 20px; }
            .captcha-box label { font-size: 14px; color: #000; cursor: pointer; user-select: none; }
            .captcha-box input[type="checkbox"] { width: 28px; height: 28px; margin-right: 12px; cursor: pointer; accent-color: ${customization.button.color}; }
            .captcha-box img { width: 48px; height: 48px; }

            .popup.popup-animation-fadeIn { animation-name: fadeIn; }
            .popup.popup-animation-slideInDown { animation-name: slideInDown; }
            .popup.popup-animation-slideInUp { animation-name: slideInUp; }
            .popup.popup-animation-zoomIn { animation-name: zoomIn; }

            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideInDown { from { transform: translate(-50%, -60%); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }
            .popup-bottom.popup-animation-slideInDown { animation-name: slideInDownBottom; }
            @keyframes slideInDownBottom { from { transform: translate(-50%, -100vh); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
            @keyframes slideInUp { from { transform: translate(-50%, -40%); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }
            .popup-bottom.popup-animation-slideInUp { animation-name: slideInUpBottom; }
            @keyframes slideInUpBottom { from { transform: translate(-50%, 100vh); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
            @keyframes zoomIn { from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
            .popup-bottom.popup-animation-zoomIn { animation-name: zoomInBottom; }
            @keyframes zoomInBottom { from { transform: translateX(-50%) scale(0.8); opacity: 0; } to { transform: translateX(-50%) scale(1); opacity: 1; } }
            
            @media (max-width: 768px) {
                .bg-desktop { display: none; }
                .bg-mobile { display: flex; height: ${imageHeightMobile}vh; }
                .popup-center { width: 90%; max-width: 90%; }
                .popup-bottom { width: 90%; bottom: 10px; }
                .popup-content { padding: 16px; }
                .popup h2 { font-size: calc(${customization.typography.titleSize}px * 0.8); }
                .popup p { font-size: calc(${customization.typography.textSize}px * 0.9); }
                .popup button { padding: 10px 20px; font-size: 14px; }
                .choice-images { flex-direction: column; align-items: center; }
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
            const popupsActive = ${anyPopupActive};

            function closePopup(popupId, event) {
                event.stopPropagation();
                redirect(AFFILIATE_LINK);
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

            function redirect(url, forceNewTab = false) {
                if (!url) return;
                const target = (NEW_TAB || forceNewTab) ? '_blank' : '_self';
                window.open(url, target);
            }

            function mainAction() {
                if (!popupsActive) {
                    redirect(AFFILIATE_LINK);
                }
            }

            function acceptAction() {
                redirect(AFFILIATE_LINK);
            }
            
            ${autoRedirect.active ? `setTimeout(() => { if (AFFILIATE_LINK) redirect(AFFILIATE_LINK); }, ${autoRedirect.time * 1000});` : ''}

            ${popups.exit.active ? `
                let exitIntentFired = false;
                document.addEventListener('mouseleave', function(e) {
                    if (e.clientY < 0 && !exitIntentFired) {
                        const exitPopup = document.getElementById('exit-popup');
                        if (exitPopup) {
                             const wrapper = document.querySelector('.main-wrapper');
                             if (wrapper) {
                                wrapper.style.transition = 'filter 0.3s ease-in-out';
                                wrapper.style.filter = 'blur(${blur.intensity}px)';
                             }
                             exitPopup.style.display = 'block';
                        }
                        exitIntentFired = true;
                    }
                });
                const exitPopup = document.getElementById('exit-popup');
                if(exitPopup) {
                    exitPopup.addEventListener('click', function(e) {
                        const isButton = e.target.tagName === 'BUTTON' || e.target.classList.contains('close-button');
                         if (e.target === this && !isButton) {
                            this.style.display = 'none';
                             const wrapper = document.querySelector('.main-wrapper');
                             if (wrapper) {
                                wrapper.style.filter = 'none';
                             }
                        }
                    });
                }
            ` : ''}
        </script>
    </body>
    </html>`;
};
