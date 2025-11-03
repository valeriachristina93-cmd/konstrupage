
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
    };
    discount: {
      active: boolean;
      text: string;
      icon: boolean;
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
      image1Url: string;
      image2Url: string;
    };
    captcha: {
      active: boolean;
      title: string;
      description: string;
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
    language: string;
    buttonColor: string;
    popupColor: string;
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
  };
};






