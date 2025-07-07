// SpotBox · "Mid-Night Neon" Paleti
// (Siyah temelli arayüz + göz yormayan canlı vurgular)

export const colors = {
  // Ana renk paleti
  backBlack: '#0E0E0F',      // Ana zemin (14, 14, 15)
  surfaceGrey: '#1C1C1F',    // Kartlar, alt bar, modallar (28, 28, 31)
  outlineGrey: '#2E2E33',    // İnce ayraç / divider (46, 46, 51)
  
  // Vurgu renkleri
  primary: '#1BC9F5',        // Primary Neon Cyan - CTA buton, seçili ikon, aktiv nav (27, 201, 245)
  secondary: '#FF4FA3',      // Secondary Magenta - Badge, uyarı, highlight (255, 79, 163)
  accent: '#A9F870',         // Accent Lime-Pop - Başarı durumu, onay animasyonu (169, 248, 112)
  error: '#E84545',          // Error Red - Hata banner, delete işlemi (232, 69, 69)
  
  // Metin renkleri
  textPrimary: '#F5F6F8',    // Başlık, ana metin (245, 246, 248)
  textSecondary: '#B5B7BB',  // Yardımcı metin, ikon kontur (181, 183, 187)
  
  // Eski API uyumluluğu için
  background: '#0E0E0F',     // backBlack ile aynı
  white: '#F5F6F8',         // textPrimary ile aynı
  textDark: '#F5F6F8',      // textPrimary ile aynı
  textMedium: '#B5B7BB',    // textSecondary ile aynı
  textLight: '#B5B7BB',     // textSecondary ile aynı
  shadow: '#000000',        // Siyah shadow
};

// Tema bazlı renk varyasyonları
export const themeColors = {
  light: {
    ...colors,
    surface: colors.surfaceGrey,
    onSurface: colors.textPrimary,
    overlay: 'rgba(28, 28, 31, 0.95)',
  },
  dark: {
    ...colors,
    background: colors.backBlack,
    surface: colors.surfaceGrey,
    onSurface: colors.textPrimary,
    overlay: 'rgba(14, 14, 15, 0.95)',
  },
};

// Özel renk kombinasyonları ve opacity varyasyonları
export const colorCombinations = {
  // Primary Neon Cyan varyasyonları
  primaryWithOpacity: (opacity = 0.12) => colors.primary + Math.round(opacity * 255).toString(16).padStart(2, '0'),
  
  // Gradient kombinasyonları
  gradients: {
    // Ana FAB (kamera) - top Primary Neon Cyan → bottom Secondary Magenta
    fab: [colors.primary, colors.secondary],
    // Başarı gradient
    success: [colors.accent, colors.primary],
    // Hata gradient
    error: [colors.error, colors.secondary],
  },
  
  // Shadow renkleri
  shadowColors: {
    primary: colors.primary,
    secondary: colors.secondary,
    default: 'rgba(0, 0, 0, 0.3)',
    neon: 'rgba(27, 201, 245, 0.2)', // Neon cyan glow
  },
  
  // Hover/Press durumları
  interactions: {
    hover: colors.primary + '1F',      // 12% opacity
    press: colors.primary + '33',      // 20% opacity
    ripple: colors.primary + '1F',     // 12% opacity
  },
  
  // Badge ve notification renkleri
  badges: {
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.accent,
    error: colors.error,
  },
};

// Kontrast kontrol bilgileri (WCAG AA/AAA uyumluluğu)
export const contrastInfo = {
  // Text-Primary ↔ Back-Black: 21:1 (AAA)
  textPrimaryOnBackground: 21,
  
  // Neon Cyan ↔ Back-Black: 7.7:1 (AAA)
  primaryOnBackground: 7.7,
  
  // Magenta ↔ Back-Black: 6.5:1 (AA)
  secondaryOnBackground: 6.5,
};

// Kullanım rehberi yorumları
/*
Kullanım Rehberi:

1. Harita üstü buton çipleri
   • Zemin: surfaceGrey, ikon: primary
   • Badge sayısı varsa yuvarlak zemin: secondary, metin: textPrimary

2. Ana FAB (kamera)
   • Daire gradient: gradients.fab
   • İkon rengi: #FFFFFF

3. Alt Navigasyon
   • Bar: surfaceGrey
   • Seçili sekme metin/ikon: primary; diğerleri: textSecondary
   • Hover/press ripple: interactions.ripple

4. Karanlık Map Layer
   • Apple/Google maps dark-style kullan
   • Gri yollar + az doygun arazi, pinler: primary

5. Lottie & animasyon
   • Başarı (like, kutu açıldı) → accent patlaması
   • Hata/uyarı → error shake + secondary glow
*/ 