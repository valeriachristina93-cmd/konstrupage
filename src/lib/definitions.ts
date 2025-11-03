

export type PageConfig = {
  desktopImage: string;
  mobileImage: string;
  imageHeightDesktop: number;
  imageHeightMobile: number;
  affiliateLink: string;
  newTab: boolean;
  autoRedirect: {
    active: boolean;
    time: number;
  };
  popups: {
    cookies: {
      active: boolean;
      message: string;
      buttonText: string;
    };
    ageVerification: {
      active: boolean;
      message: string;
      yesButtonText: string;
      noButtonText: string;
      yesButtonColor: string;
      noButtonColor: string;
      buttonWidth: number;
    };
    discount: {
      active: boolean;
      text: string;
      description: string;
      icon: string;
    };
    exit: {
      active: boolean;
      imageUrl: string;
      redirectLink: string;
    };
    custom: {
      active: boolean;
      title: string;
      description: string;
      buttonText: string;
    };
    choice: {
      active: boolean;
      title: string;
      description: string;
      useCustomImages: boolean;
      image1Url: string;
      image2Url: string;
      customImageWidth: number;
    };
    captcha: {
      active: boolean;
      title: string;
      description: string;
      captchaType: 'checkbox' | 'slide';
    };
  };
  footer: {
    active: boolean;
    privacyLink: string;
    termsLink: string;
    backgroundColor: string;
    textColor: string;
  };
  disclaimer: {
    active: boolean;
    text: string;
    backgroundColor: string;
    textColor: string;
  };
  overlay: {
    active: boolean;
    opacity: number;
  };
  blur: {
    active: boolean;
    intensity: number;
  };
  customization: {
    button: {
      color: string;
      textColor: string;
      width: number;
      borderRadius: number;
      alignment: 'left' | 'center' | 'right';
      shadow: {
        active: boolean;
        intensity: number;
      };
    };
    typography: {
      titleColor: string;
      textColor: string;
      titleSize: number;
      textSize: number;
    };
    popup: {
        maxWidth: number;
        borderRadius: number;
        padding: number;
        gap: number;
        backgroundColor: string;
    },
    popupPosition: 'center' | 'bottom';
    customHtml: string;
    showCloseButton: boolean;
    popupContour: {
      active: boolean;
      width: number;
      style: 'solid' | 'dashed' | 'dotted';
      color: string;
    };
    popupAnimation: 'fadeIn' | 'slideInDown' | 'slideInUp' | 'zoomIn';
    popupAnimationDuration: number;
    shadow: {
      active: boolean;
      intensity: number;
    };
  };
};




