import { StyleSheet } from 'react-native';
import { colors, colorCombinations } from '../constants/colors';

export const homeScreenStyles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: colors.backBlack,
  },
  fullScreenMap: {
    flex: 1,
  },
  headerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12, // Design system: s3 = 12dp
  },
  modernButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceGrey,
    borderWidth: 1,
    borderColor: colors.outlineGrey,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  profileButtonHeader: {
    backgroundColor: 'transparent', // arkaplan kaldırıldı
    shadowColor: colors.primary, // neon mavi gölge eklendi
    padding: 2,
    width: 48, // Design system: min touch target 48x48dp
    height: 48,
    borderRadius: 24,
    borderWidth: 0, // çizgi kaldırıldı
    borderColor: 'transparent',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
  },
  profileImageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 0, // çizgi kaldırıldı
    borderColor: 'transparent',
    backgroundColor: 'transparent', // arkaplan kaldırıldı
    shadowColor: colors.primary, // neon mavi gölge
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
  },
  friendRequestButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent', // arkaplan kaldırıldı
    borderWidth: 0, // çizgisiz
    borderColor: 'transparent',
    shadowColor: colors.secondary, // magenta glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 14,
  },
  friendRequestIcon: {
    width: 35,
    height: 35,
    tintColor: colors.textSecondary, // koyu gri
    marginTop: -3,
    marginLeft: -6,
  },
  buttonGlow: {
    width: '100%',
    height: '100%',
    borderRadius: 24, // containerla aynı radius
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // iç glow kaldırıldı – sadece dış glow kullanılacak
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surfaceGrey,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  badgeText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 112, // Design system: Bottom bar'ın (72dp) + s6 (24dp) + s4 (16dp) üzerine
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // Bottom bar'ın üzerinde görünmesi için
  },
  overlayLogo: {
    width: 80, // Design system: FAB boyutu + s2 (8dp) büyütüldü
    height: 80, // Design system: FAB boyutu + s2 (8dp) büyütüldü - perfect circle
    backgroundColor: colors.surfaceGrey,
    borderRadius: 40, // Design system: Perfect circle (width/2)
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 }, // Design system: elevation2 = 4dp
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 4, // Design system: elevation2 = 4
    borderWidth: 2, // Design system: Thicker border for camera button
    borderColor: colors.textPrimary, // White border
  },
  logoAsset: {
    width: 44, // Design system: Logo asset boyutu (80dp container'a uygun)
    height: 44, // Design system: Logo asset boyutu (80dp container'a uygun)
    // tintColor kaldırıldı - orijinal renklerinde görünecek
  },
  locationButtonContainer: {
    position: 'absolute',
    bottom: 112, // Design system: Kamera butonu ile aynı seviye
    right: 16, // Design system: s4 = 16dp
    zIndex: 1000,
  },
  locationButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'transparent', // zemin kaldırıldı
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary, // ikonla aynı neon gölgesi
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  locationIcon: {
    width: 30,
    height: 30,
    tintColor: colors.textSecondary, // koyu gri
  },
  
  // Modern Animated FAB Styles - Neon Gradient
  fabContainer: {
    position: 'absolute',
    bottom: 212, // Design system: Logo'nun (112dp) + logo height (80dp) + s5 (20dp) üzerine
    alignSelf: 'center',
    width: 70,
    height: 70,
    zIndex: 1001,
  },
  fabTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 2,
    borderColor: colors.secondary,
    zIndex: 4,
  },
  fabGlowOuter: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    opacity: 0.4,
    zIndex: 1,
  },
  fabGlowMiddle: {
    position: 'absolute',
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.primary,
    opacity: 0.08,
    zIndex: 2,
  },
  fabGlowInner: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.primary,
    opacity: 0.15,
    zIndex: 3,
  },
  mapDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    opacity: 0.1,
    zIndex: 1,
    pointerEvents: 'none',
  },
  appleLogoOverlay: {
    position: 'absolute',
    bottom: 35,
    left: -0,
    width: 40,
    height: 40,
    zIndex: 2000,
    transform: [{ rotate: '270deg' }],
  },
}); 