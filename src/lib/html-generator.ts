
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


    const popupStyles = {
        'dark': 'background-color: #1F2937; color: #F3F4F6;',
        'white': 'background-color: #FFFFFF; color: #1F2937; border: 1px solid #E5E7EB;',
        'light-gray': 'background-color: #F3F4F6; color: #1F2937;',
        'dark-gray': 'background-color: #374151; color: #F3F4F6;',
    };
    
    const footerStyles = {
        'dark': 'background-color: #111827; color: #D1D5DB;',
        'light': 'background-color: #F9FAFB; color: #374151;',
    };

    const getPopupPositionClass = () => {
        if (customization.popupPosition === 'bottom') {
            return 'popup-bottom';
        }
        return 'popup-center';
    };

    const cookiePopup = popups.cookies.active ? `
        <div id="cookie-popup" class="popup ${getPopupPositionClass()}" style="${popupStyles[customization.popupColor]}">
            <div class="popup-content">
                <h3>Políticas de Cookies</h3>
                <p>${popups.cookies.message}</p>
                <button style="background-color: ${customization.buttonColor}; color: ${customization.buttonColor === '#FFFFFF' ? '#000' : '#fff'};" onclick="acceptAction()">${popups.cookies.buttonText}</button>
            </div>
        </div>
    ` : '';
    
    const agePopup = popups.ageVerification.active ? `
        <div id="age-popup" class="popup popup-bottom" style="${popupStyles[customization.popupColor]}">
             <div class="popup-content">
                <p>Você confirma que tem mais de 18 anos?</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button style="background-color: ${customization.buttonColor}; color: ${customization.buttonColor === '#FFFFFF' ? '#000' : '#fff'};" onclick="acceptAction()">Sim</button>
                    <button style="background-color: #6B7280; color: #fff;" onclick="window.history.back()">Não</button>
                </div>
            </div>
        </div>
    ` : '';

    const discountPopup = popups.discount.active ? `
         <div id="discount-popup" class="popup popup-center" style="${popupStyles[customization.popupColor]}">
             <div class="popup-content">
                ${popups.discount.icon ? '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:${customization.buttonColor};"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><circle cx="12" cy="12" r="4"></circle></svg>' : ''}
                <h2>${popups.discount.text}</h2>
                <p>Oferta por tempo limitado!</p>
                <button style="background-color: ${customization.buttonColor}; color: ${customization.buttonColor === '#FFFFFF' ? '#000' : '#fff'};" onclick="acceptAction()">Aproveitar Agora</button>
            </div>
        </div>
    ` : '';

    const customPopup = popups.custom.active ? `
        <div id="custom-popup" class="popup ${getPopupPositionClass()}" style="${popupStyles[customization.popupColor]}">
            <div class="popup-content">
                <h2>${popups.custom.title}</h2>
                <p>${popups.custom.description}</p>
                <button style="background-color: ${customization.buttonColor}; color: ${customization.buttonColor === '#FFFFFF' ? '#000' : '#fff'};" onclick="acceptAction()">${popups.custom.buttonText}</button>
            </div>
        </div>
    ` : '';
    
    const choicePopup = popups.choice.active ? `
        <div id="choice-popup" class="popup popup-center" style="${popupStyles[customization.popupColor]}">
            <div class="popup-content">
                <h2>${popups.choice.title}</h2>
                <p>${popups.choice.description}</p>
                <div class="choice-images">
                    <img src="${popups.choice.image1Url}" onclick="acceptAction()" />
                    <img src="${popups.choice.image2Url}" onclick="acceptAction()" />
                </div>
            </div>
        </div>
    ` : '';

    const captchaPopup = popups.captcha.active ? `
        <div id="captcha-popup" class="popup popup-center" style="${popupStyles[customization.popupColor]}">
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
        <div id="exit-popup" class="popup popup-center" style="display:none; ${popupStyles[customization.popupColor]}">
             <div class="popup-content" style="padding:0; max-width: 600px;">
                <img src="${popups.exit.imageUrl}" alt="Oferta de Saída" style="width:100%; height:auto; display:block; border-radius: 8px 8px 0 0;" />
                <div style="padding: 24px;">
                    <h3>Espere, não vá embora!</h3>
                    <p>Temos uma oferta especial para você.</p>
                    <button style="background-color: ${customization.buttonColor}; color: ${customization.buttonColor === '#FFFFFF' ? '#000' : '#fff'};" onclick="redirect('${popups.exit.redirectLink || affiliateLink}', true)">Pegar Oferta</button>
                </div>
            </div>
        </div>
    ` : '';

    const footerSection = footer.active ? `
        <footer style="${footerStyles[footer.theme]}">
            <a href="${footer.privacyLink}">Política de Privacidade</a>
            <span>|</span>
            <a href="${footer.termsLink}">Termos de Uso</a>
        </footer>
    ` : '';

    const disclaimerSection = disclaimer.active ? `
        <div class="disclaimer">
            <p>${disclaimer.text}</p>
        </div>
    ` : '';
    
    return `
    <!DOCTYPE html>
    <html lang="${customization.language}">
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
            .disclaimer { background: #f3f4f6; padding: 8px; text-align: center; font-size: 12px; color: #4b5563; position: fixed; bottom: ${footer.active ? '49px' : '0'}; width: 100%; z-index: 10;}
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
            .popup { position: fixed; z-index: 100; box-shadow: 0 10px 25px rgba(0,0,0,0.2); border-radius: 8px; animation: fadeIn 0.3s ease-in-out; box-sizing: border-box; }
            .popup-center { top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 500px; }
            .popup-bottom { bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 800px; }
            .popup-content { padding: 24px; text-align: center; }
            .popup h3 { margin-top: 0; font-size: 20px; }
            .popup h2 { margin-top: 0; font-size: 28px; font-weight: bold; }
            .popup p { margin-bottom: 20px; font-size: 16px; line-height: 1.5; }
            .popup button { 
                border: none; padding: 12px 24px; font-size: 16px; font-weight: bold; border-radius: 6px; cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .popup button:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            .choice-images { display: flex; justify-content: center; gap: 20px; }
            .choice-images img { width: 120px; height: auto; cursor: pointer; border-radius: 8px; transition: transform 0.2s, box-shadow 0.2s; border: 2px solid transparent; }
            .choice-images img:hover { transform: scale(1.05); box-shadow: 0 8px 15px rgba(0,0,0,0.2); border-color: ${customization.buttonColor}; }
            .captcha-box { display: flex; align-items: center; justify-content: space-between; background-color: #f9f9f9; border: 1px solid #d3d3d3; padding: 15px; border-radius: 3px; margin-top: 20px; }
            .captcha-box label { font-size: 14px; color: #000; cursor: pointer; user-select: none; }
            .captcha-box input[type="checkbox"] { width: 28px; height: 28px; margin-right: 12px; cursor: pointer; accent-color: ${customization.buttonColor}; }
            .captcha-box img { width: 48px; height: 48px; }
            @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, -45%); } to { opacity: 1; transform: translate(-50%, -50%); } }
            .popup-bottom { animation: slideInUp 0.3s ease-in-out; }
            @keyframes slideInUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translateX(-50%); } }
            
            @media (max-width: 768px) {
                .bg-desktop { display: none; }
                .bg-mobile { display: flex; height: ${imageHeightMobile}vh; }
                .popup-center { width: 90%; max-width: 90%; }
                .popup-bottom { width: 90%; bottom: 10px; }
                .popup-content { padding: 16px; }
                .popup h2 { font-size: 22px; }
                .popup p { font-size: 14px; }
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
                        const isButton = e.target.tagName === 'BUTTON';
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
