import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
};

// Specific size hooks
export const useAstronautSize = () => {
  const [size, setSize] = useState({ width: 900, height: 900 });

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) { // mobile
        setSize({ width: 300, height: 300 });
      } else if (window.innerWidth < 768) { // small tablet
        setSize({ width: 400, height: 400 });
      } else if (window.innerWidth < 1024) { // tablet
        setSize({ width: 600, height: 600 });
      } else { // desktop
        setSize({ width: 1200, height: 1200 });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};

export const useProjectSizes = () => {
  // Combined width and height media queries for specific cases
  const is2XLTall = useMediaQuery('(min-width: 1536px) and (min-height: 900px)');
  const is2XLShort = useMediaQuery('(min-width: 1536px) and (max-height: 699px)');
  const is2XLNormal = useMediaQuery('(min-width: 1536px) and (min-height: 700px) and (max-height: 899px)');
  
  const isXLTall = useMediaQuery('(min-width: 1280px) and (max-width: 1535px) and (min-height: 900px)');
  const isXLShort = useMediaQuery('(min-width: 1280px) and (max-width: 1535px) and (max-height: 699px)');
  const isXLNormal = useMediaQuery('(min-width: 1280px) and (max-width: 1535px) and (min-height: 700px) and (max-height: 899px)');
  
  const isLGTall = useMediaQuery('(min-width: 1024px) and (max-width: 1279px) and (min-height: 900px)');
  const isLGShort = useMediaQuery('(min-width: 1024px) and (max-width: 1279px) and (max-height: 699px)');
  const isLGNormal = useMediaQuery('(min-width: 1024px) and (max-width: 1279px) and (min-height: 700px) and (max-height: 899px)');
  
  const isTabletTall = useMediaQuery('(min-width: 768px) and (max-width: 1023px) and (min-height: 900px)');
  const isTabletShort = useMediaQuery('(min-width: 768px) and (max-width: 1023px) and (max-height: 699px)');
  const isTabletNormal = useMediaQuery('(min-width: 768px) and (max-width: 1023px) and (min-height: 700px) and (max-height: 899px)');
  
  const isMobileTall = useMediaQuery('(max-width: 767px) and (min-height: 700px)');
  const isMobileShort = useMediaQuery('(max-width: 767px) and (max-height: 499px)');
  const isMobileNormal = useMediaQuery('(max-width: 767px) and (min-height: 500px) and (max-height: 699px)');
  
  // Mobile-specific breakpoints for optimization
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const isSmallMobile = useMediaQuery("(max-width: 480px)");
  const is2xl = useMediaQuery("(min-width: 1536px)");

  // Mobile-specific configurations for performance optimization
  const getMobileOptimizations = () => {
    if (isSmallMobile) {
      return {
        // UI styling for small mobile
        cardPadding: "p-3",
        textSizes: {
          title: "text-lg",
          description: "text-xs",
          tech: "text-xs px-2 py-0.5",
          link: "text-xs"
        },
        // Animation timing optimized for small screens
        autoSlideDuration: 2500,
        transitionDuration: 0.2,
      };
    }
    
    if (isMobile) {
      return {
        // UI styling for mobile
        cardPadding: "p-4",
        textSizes: {
          title: "text-xl",
          description: "text-sm",
          tech: "text-xs px-2 py-0.5",
          link: "text-sm"
        },
        // Animation timing optimized for mobile
        autoSlideDuration: 3000,
        transitionDuration: 0.3,
      };
    }
    
    if (isTablet) {
      return {
        // UI styling for tablet - IMPROVED
        cardPadding: "p-6", // Increased from p-5
        textSizes: {
          title: "text-2xl", // Increased from text-xl
          description: "text-base", // Increased from text-sm
          tech: "text-sm px-3 py-1", // Increased from text-xs px-2 py-0.5
          link: "text-base" // Increased from text-sm
        },
        // Animation timing for tablet
        autoSlideDuration: 3500,
        transitionDuration: 0.4,
      };
    }
    
    // Desktop default
    return {
      // UI styling for desktop
      cardPadding: "p-4 md:p-6",
      textSizes: {
        title: "text-lg xl:text-xl",
        description: "text-xs xl:text-sm",
        tech: "text-xs px-2 py-0.5",
        link: "text-xs xl:text-sm"
      },
      // Animation timing for desktop
      autoSlideDuration: 4000,
      transitionDuration: 0.5,
    };
  };

  const mobileOptimizations = getMobileOptimizations();

  // 2XL+ screens with height variations
  if (is2XLTall) {
    return {
      planetSize: 220,
      spacing: 240,
      previewWidth: 1500,
      // Desktop preview dimensions (image + content)
      previewImageWidth: 360,  // w-80 equivalent (320px)
      previewImageHeight: 224, // h-56 equivalent (224px)
      previewContentHeight: 224, // Match image height for alignment
      // Mobile preview dimensions - REDUCED
      mobilePreviewImageHeight: 140, // Reduced from 224 to 140
      containerPaddingTop: 112,    // pt-28 equivalent (112px)
      containerPaddingBottom: 64,  // pb-16 equivalent (64px)
      headerMarginBottom: 56,      // mb-14 equivalent (56px)
      // Mobile optimization flags and configs
      isMobile,
      isTablet,
      isSmallMobile,
      is2xl,
      ...mobileOptimizations
    };
  }
  
  if (is2XLShort) {
    return {
      planetSize: 140,
      spacing: 160,
      previewWidth: 1500,
      // Smaller dimensions for short screens
      previewImageWidth: 256,  // w-64 equivalent (256px)
      previewImageHeight: 160, // h-40 equivalent (160px)
      previewContentHeight: 160,
      mobilePreviewImageHeight: 120, // Reduced from 160 to 120
      containerPaddingTop: 80,    // pt-28 equivalent (112px)
      containerPaddingBottom: 64,  // pb-16 equivalent (64px)
      headerMarginBottom: 56,
      // Mobile optimization flags and configs
      isMobile,
      isTablet,
      isSmallMobile,
      is2xl,
      ...mobileOptimizations
    };
  }
  
  if (is2XLNormal) {
    return {
      planetSize: 160,
      spacing: 200,
      previewWidth: 1500,
      // Standard 2XL dimensions
      previewImageWidth: 320,  // w-80
      previewImageHeight: 200, // h-56
      previewContentHeight: 144, // h-36 as in original code
      mobilePreviewImageHeight: 130, // Reduced from 192 to 130
      containerPaddingTop: 94,    // pt-28 equivalent (112px)
      containerPaddingBottom: 64,  // pb-16 equivalent (64px)
      headerMarginBottom: 26,
      // Mobile optimization flags and configs
      isMobile,
      isTablet,
      isSmallMobile,
      is2xl,
      ...mobileOptimizations
    };
  }
  
  // XL screens with height variations
  if (isXLTall) {
    return {
      planetSize: 180,
      spacing: 200,
      previewWidth: 460,
      previewImageWidth: 288,  // w-72 (288px)
      previewImageHeight: 216, // h-54 (216px)
      previewContentHeight: 216,
      mobilePreviewImageHeight: 140, // Reduced from 224 to 140
      containerPaddingTop: 112,
      containerPaddingBottom: 64,
      headerMarginBottom: 56,
      // Mobile optimization flags and configs
      isMobile,
      isTablet,
      isSmallMobile,
      is2xl,
      ...mobileOptimizations
    };
  }
  
  if (isXLShort) {
    return {
      planetSize: 120,
      spacing: 140,
      previewWidth: 460,
      previewImageWidth: 256,  // w-64
      previewImageHeight: 144, // h-36
      previewContentHeight: 144,
      mobilePreviewImageHeight: 120, // Reduced from 144 to 120
      containerPaddingTop: 80,
      containerPaddingBottom: 64,
      headerMarginBottom: 40,
      // Mobile optimization flags and configs
      isMobile,
      isTablet,
      isSmallMobile,
      is2xl,
      ...mobileOptimizations
    };
  }
  
  if (isXLNormal) {
    return {
      planetSize: 150,
      spacing: 170,
      previewWidth: 460,
      previewImageWidth: 256,  // w-64 as in original
      previewImageHeight: 176, // h-44 as in original
      previewContentHeight: 176,
      mobilePreviewImageHeight: 130, // Reduced from 192 to 130
      containerPaddingTop: 100,
      containerPaddingBottom: 64,
      headerMarginBottom: 48,
      // Mobile optimization flags and configs
      isMobile,
      isTablet,
      isSmallMobile,
      is2xl,
      ...mobileOptimizations
    };
  }
  
  // LG screens with height variations
  if (isLGTall) {
    return {
      planetSize: 160,
      spacing: 180,
      previewWidth: 420,
      previewImageWidth: 288,  // w-72 as in original LG
      previewImageHeight: 192, // h-48 as in original LG
      previewContentHeight: 192,
      mobilePreviewImageHeight: 140, // Reduced from 208 to 140
      containerPaddingTop: 112,
      containerPaddingBottom: 64,
      headerMarginBottom: 56,
      // Mobile optimization flags and configs
      isMobile,
      isTablet,
      isSmallMobile,
      is2xl,
      ...mobileOptimizations
    };
  }
  
  if (isLGShort) {
    return {
      planetSize: 100,
      spacing: 120,
      previewWidth: 420,
      previewImageWidth: 240,  // w-60
      previewImageHeight: 128, // h-32
      previewContentHeight: 128,
      mobilePreviewImageHeight: 110, // Reduced from 128 to 110
      containerPaddingTop: 80,
      containerPaddingBottom: 64,
      headerMarginBottom: 40,
      // Mobile optimization flags and configs
      isMobile,
      isTablet,
      isSmallMobile,
      is2xl,
      ...mobileOptimizations
    };
  }
  
  if (isLGNormal) {
    return {
      planetSize: 130,
      spacing: 150,
      previewWidth: 420,
      previewImageWidth: 288,  // w-72
      previewImageHeight: 192, // h-48
      previewContentHeight: 192,
      mobilePreviewImageHeight: 130, // Reduced from 192 to 130
      containerPaddingTop: 100,
      containerPaddingBottom: 64,
      headerMarginBottom: 48,
      // Mobile optimization flags and configs
      isMobile,
      isTablet,
      isSmallMobile,
      is2xl,
      ...mobileOptimizations
    };
  }
  
  // Tablet with height variations - IMPROVED SIZES
  if (isTabletTall) {
    return {
      planetSize: 140,
      spacing: 160,
      previewWidth: 600, // Increased from 400
      previewImageWidth: 350, // Increased from 280
      previewImageHeight: 220, // Increased from 180
      previewContentHeight: 220, // Increased from 180
      mobilePreviewImageHeight: 200, // Increased from 140
      containerPaddingTop: 112,
      containerPaddingBottom: 64,
      headerMarginBottom: 56,
      // Mobile optimization flags and configs
      isMobile,
      isTablet,
      isSmallMobile,
      is2xl,
      ...mobileOptimizations
    };
  }
  
  if (isTabletShort) {
    return {
      planetSize: 90,
      spacing: 110,
      previewWidth: 550, // Increased from 400
      previewImageWidth: 320, // Increased from 240
      previewImageHeight: 160, // Increased from 120
      previewContentHeight: 160, // Increased from 120
      mobilePreviewImageHeight: 140, // Increased from 110
      containerPaddingTop: 80,
      containerPaddingBottom: 64,
      headerMarginBottom: 40,
      // Mobile optimization flags and configs
      isMobile,
      isTablet,
      isSmallMobile,
      is2xl,
      ...mobileOptimizations
    };
  }
  
  if (isTabletNormal) {
    return {
      planetSize: 120,
      spacing: 140,
      previewWidth: 580, // Increased from 400
      previewImageWidth: 340, // Increased from 260
      previewImageHeight: 200, // Increased from 160
      previewContentHeight: 200, // Increased from 160
      mobilePreviewImageHeight: 180, // Increased from 130
      containerPaddingTop: 100,
      containerPaddingBottom: 64,
      headerMarginBottom: 48,
      // Mobile optimization flags and configs
      isMobile,
      isTablet,
      isSmallMobile,
      is2xl,
      ...mobileOptimizations
    };
  }
  
  // Mobile with height variations - MAJOR REDUCTIONS HERE
  if (isMobileTall) {
    return {
      planetSize: 120,
      spacing: 50,
      previewWidth: 200,
      previewImageWidth: 0, // Not used on mobile
      previewImageHeight: 0,
      previewContentHeight: 0,
      mobilePreviewImageHeight: 140, // Reduced from 224 to 140
      containerPaddingTop: 60,
      containerPaddingBottom: 32,
      headerMarginBottom: 24,
      // Mobile optimization flags and configs
      isMobile,
      isTablet,
      isSmallMobile,
      is2xl,
      ...mobileOptimizations
    };
  }
  
  if (isMobileShort) {
    return {
      planetSize: 80,
      spacing: 30,
      previewWidth: 200,
      previewImageWidth: 0,
      previewImageHeight: 0,
      previewContentHeight: 0,
      mobilePreviewImageHeight: 80, // Reduced from 128 to 100
      containerPaddingTop: 40,
      containerPaddingBottom: 32,
      headerMarginBottom: 16,
      // Mobile optimization flags and configs
      isMobile,
      isTablet,
      isSmallMobile,
      is2xl,
      ...mobileOptimizations
    };
  }
  
  if (isMobileNormal) {
    return {
      planetSize: 100,
      spacing: 40,
      previewWidth: 200,
      previewImageWidth: 0,
      previewImageHeight: 0,
      previewContentHeight: 0,
      mobilePreviewImageHeight: 100, // Reduced from 192 to 120
      containerPaddingTop: 50,
      containerPaddingBottom: 32,
      headerMarginBottom: 20,
      // Mobile optimization flags and configs
      isMobile,
      isTablet,
      isSmallMobile,
      is2xl,
      ...mobileOptimizations
    };
  }
  
  // Fallback (should not reach here with proper media queries)
  return {
    planetSize: 100,
    spacing: 40,
    previewWidth: 200,
    previewImageWidth: 256,
    previewImageHeight: 176,
    previewContentHeight: 176,
    mobilePreviewImageHeight: 100, // Reduced from 192 to 120
    containerPaddingTop: 112,    // pt-28 equivalent (112px)
    containerPaddingBottom: 64,  // pb-16 equivalent (64px)
    headerMarginBottom: 56,
    // Mobile optimization flags and configs
    isMobile,
    isTablet,
    isSmallMobile,
    is2xl,
    ...mobileOptimizations
  };
};
