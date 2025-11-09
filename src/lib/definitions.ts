

export type PostPageConfig = {
  active: boolean;
  productName: string;
  content: string;
  imageUrl: string;
};

export type PageConfig = {
  desktopImage: string;
  mobileImage: string;
  imageHeightDesktop: number;
  imageHeightMobile: number;
  affiliateLink: string;
  newTab: boolean;
  fullPageClick: boolean;
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
      iconSize: number;
    };
    exit: {
      active: boolean;
      imageUrl: string;
      redirectLink: string;
      imageOnly: boolean;
    };
    custom: {
      active: boolean;
      triggerOnExit: boolean;
      title: string;
      description: string;
      buttonText: string;
      imageUrl: string;
      imageLayout: 'none' | 'top' | 'side';
      imageSide: 'left' | 'right';
      imageSideWidth: number;
      imageInner: {
        active: boolean;
        imageUrl: string;
        width: number;
      };
      secondButton: {
        active: boolean;
        text: string;
        link: string;
        style: 'filled' | 'outline';
        color: string;
        textColor: string;
        outlineWidth: number;
        width: number;
      };
      buttonsAlignment: 'vertical' | 'horizontal';
      countdown: {
        active: boolean;
        time: string; // HH:MM:SS
        position: 'aboveTitle' | 'belowText';
        style: 'style1' | 'style2' | 'style3';
        color: string;
        fontSize: number;
        boxColor: string;
      };
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
    gender: {
      active: boolean;
      title: string;
      description: string;
      iconSize: number;
      useCustomImages: boolean;
      includeOther: boolean;
      maleImageUrl: string;
      femaleImageUrl: string;
      otherImageUrl: string;
      maleText: string;
      femaleText: string;
      otherText: string;
    };
    captcha: {
      active: boolean;
      title: string;
      description: string;
      captchaType: 'checkbox' | 'checkbox-v2' | 'slide-v2' | 'slide-v3';
      sliderButtonColor: string;
      sliderTrackColor: string;
      sliderTextColor: string;
      sliderSuccessTextColor: string;
      sliderText: string;
      sliderSuccessText: string;
      sliderShape: 'round' | 'square';
      checkboxText: string;
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
  tracking: {
    facebookPixelId: string;
    googleAdsId: string;
    cookieLoader: {
      active: boolean;
      link: string;
      time: number;
    };
  };
  seo: {
    title: string;
    description: string;
    favicon: string;
  };
  postPages: PostPageConfig[];
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
      style: 'filled' | 'outline';
      outlineWidth: number;
    };
    typography: {
      titleColor: string;
      textColor: string;
      titleSize: number;
      textSize: number;
      fontFamily: string;
    };
    popup: {
        maxWidth: number;
        borderRadius: number;
        paddingX: number;
        paddingY: number;
        gap: number;
        backgroundColor: string;
        titleBottomMargin: number;
        descriptionBottomMargin: number;
    },
    popupPosition: 'center' | 'bottom' | 'top';
    customHtml: string;
    showCloseButton: boolean;
    closeButtonColor: string;
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


    
