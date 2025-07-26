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
      // Mobile preview dimensions
      containerPaddingTop: 112,    // pt-28 equivalent (112px)
      containerPaddingBottom: 64,  // pb-16 equivalent (64px)
      headerMarginBottom: 56,      // mb-14 equivalent (56px)
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
      mobilePreviewImageHeight: 160, // h-40 for mobile
      containerPaddingTop: 80,    // pt-28 equivalent (112px)
      containerPaddingBottom: 64,  // pb-16 equivalent (64px)
      headerMarginBottom: 56, 
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
      mobilePreviewImageHeight: 192, // h-48 for mobile
      containerPaddingTop: 94,    // pt-28 equivalent (112px)
      containerPaddingBottom: 64,  // pb-16 equivalent (64px)
      headerMarginBottom: 26, 
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
      mobilePreviewImageHeight: 224
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
      mobilePreviewImageHeight: 144
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
      mobilePreviewImageHeight: 192
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
      mobilePreviewImageHeight: 208
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
      mobilePreviewImageHeight: 128
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
      mobilePreviewImageHeight: 192
    };
  }
  
  // Tablet with height variations
  if (isTabletTall) {
    return {
      planetSize: 140,
      spacing: 160,
      previewWidth: 400,
      previewImageWidth: 280,
      previewImageHeight: 180,
      previewContentHeight: 180,
      mobilePreviewImageHeight: 200
    };
  }
  
  if (isTabletShort) {
    return {
      planetSize: 90,
      spacing: 110,
      previewWidth: 400,
      previewImageWidth: 240,
      previewImageHeight: 120,
      previewContentHeight: 120,
      mobilePreviewImageHeight: 120
    };
  }
  
  if (isTabletNormal) {
    return {
      planetSize: 120,
      spacing: 140,
      previewWidth: 400,
      previewImageWidth: 260,
      previewImageHeight: 160,
      previewContentHeight: 160,
      mobilePreviewImageHeight: 160
    };
  }
  
  // Mobile with height variations
  if (isMobileTall) {
    return {
      planetSize: 120,
      spacing: 50,
      previewWidth: 200,
      previewImageWidth: 0, // Not used on mobile
      previewImageHeight: 0,
      previewContentHeight: 0,
      mobilePreviewImageHeight: 224 // h-56 for tall mobile
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
      mobilePreviewImageHeight: 128 // h-32 for short mobile
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
      mobilePreviewImageHeight: 192 // h-48 as in original mobile
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
    mobilePreviewImageHeight: 192,
    containerPaddingTop: 112,    // pt-28 equivalent (112px)
    containerPaddingBottom: 64,  // pb-16 equivalent (64px)
    headerMarginBottom: 56, 
  };
};