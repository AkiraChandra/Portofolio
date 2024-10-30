// src/utils/theme/colors.ts

export const hexToRgb = (hex: string): number[] => {
    // Remove the hash if it exists
    hex = hex.replace('#', '');
  
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    return [r, g, b];
  };
  
  export const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };
  
  export const rgbToString = (r: number, g: number, b: number): string => {
    return `${r} ${g} ${b}`;
  };
  
  export const adjustBrightness = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex);
    const adjusted = rgb.map(c => {
      const adjusted = Math.round(c * (1 + percent / 100));
      return Math.min(255, Math.max(0, adjusted));
    });
    return rgbToHex(adjusted[0], adjusted[1], adjusted[2]);
  };
  
  export const getContrastColor = (hex: string): string => {
    const rgb = hexToRgb(hex);
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };
  
  export const getRgbVariable = (variableName: string): string => {
    if (typeof window === 'undefined') return '';
    
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--color-${variableName}`)
      .trim();
      
    return value;
  };