// Renk paleti - Merkezi renk yönetimi
export const colors = {
  primary: '#68B6EF',     // Cornflower
  secondary: '#F49097',   // Salmon
  accent: '#FFC8DD',      // Lavender Mist
  background: '#FAFAFA',  // Cotton
  white: '#FFFFFF',
  textDark: '#333333',    // Ana metin rengi
  textMedium: '#5A5A5A',  // Orta gri (tab icons için)
  textLight: '#666666',   // Açık gri
  shadow: '#000000',      // Shadow rengi
};

// Tema bazlı renk varyasyonları
export const themeColors = {
  light: {
    ...colors,
    surface: '#FFFFFF',
    onSurface: '#333333',
    overlay: 'rgba(255, 255, 255, 0.95)',
  },
  dark: {
    ...colors,
    background: '#121212',
    surface: '#1E1E1E',
    onSurface: '#FFFFFF',
    overlay: 'rgba(30, 30, 30, 0.95)',
  },
};

// Özel renk kombinasyonları
export const colorCombinations = {
  primaryWithOpacity: (opacity = 0.15) => colors.primary + Math.round(opacity * 255).toString(16).padStart(2, '0'),
  shadowColors: {
    primary: colors.primary,
    secondary: colors.secondary,
    default: '#000000',
  },
}; 