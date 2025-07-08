import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export const cameraStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backBlack,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.backBlack,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Design system: s5
  },
  camera: {
    flex: 1,
  },
  
  // Countdown Overlay
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  countdownText: {
    fontSize: 120, // Büyük ve belirgin
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  
  // Status Bar
  statusBar: {
    position: 'absolute',
    top: 100, // Header'ın altında
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  statusContainer: {
    backgroundColor: colors.surfaceGrey,
    paddingHorizontal: 16, // Design system: s4
    paddingVertical: 8, // Design system: s2
    borderRadius: 16, // Design system: roundness
    borderWidth: 1,
    borderColor: colors.outlineGrey,
  },
  statusText: {
    fontSize: 16, // Design system: bodyMedium
    fontWeight: '500',
    color: colors.textPrimary,
    lineHeight: 24, // Design system: bodyMedium
    textAlign: 'center',
  },
  
  // Header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50, // Safe area
    paddingBottom: 16, // Design system: s4
    paddingHorizontal: 16, // Design system: s4
    zIndex: 1,
  },
  closeButton: {
    backgroundColor: colors.surfaceGrey,
    borderRadius: 24, // Design system: min touch target / 2
    width: 48, // Design system: min touch target
    height: 48, // Design system: min touch target
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineGrey,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2, // Design system: elevation1
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20, // Design system: titleMedium
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 28, // Design system: titleMedium
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: colors.surfaceGrey,
    borderRadius: 24, // Design system: min touch target / 2
    width: 48, // Design system: min touch target
    height: 48, // Design system: min touch target
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineGrey,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2, // Design system: elevation1
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40, // Safe area
    paddingTop: 20, // Design system: s5
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, // Design system: s4
  },
  
  // Preview Container
  previewContainer: {
    width: 80, // Design system: Fixed width
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCount: {
    backgroundColor: colors.surfaceGrey,
    borderRadius: 16, // Design system: roundness
    paddingHorizontal: 12, // Design system: s3
    paddingVertical: 8, // Design system: s2
    borderWidth: 1,
    borderColor: colors.outlineGrey,
  },
  photoCountText: {
    fontSize: 12, // Design system: labelSmall
    fontWeight: '500',
    color: colors.textPrimary,
    lineHeight: 16, // Design system: labelSmall
    textAlign: 'center',
  },
  
  // Capture Button
  captureButton: {
    width: 80, // Design system: Large FAB
    height: 80,
    borderRadius: 40, // Perfect circle
    backgroundColor: colors.surfaceGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.textPrimary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 }, // Design system: elevation2
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4, // Design system: elevation2
  },
  captureButtonInner: {
    width: 60, // Inner circle
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.textPrimary,
  },
  capturingButton: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
    shadowColor: colors.secondary,
  },
  capturingButtonInner: {
    backgroundColor: colors.secondary,
    transform: [{ scale: 0.8 }],
  },
  completeButton: {
    backgroundColor: colors.accent,
    borderColor: colors.textPrimary,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 12,
  },
  boxIcon: {
    width: 40, // Design system: Icon size
    height: 40,
    tintColor: colors.textPrimary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  
  // Empty Space
  emptySpace: {
    width: 80, // Design system: Fixed width to balance layout
  },
  
  // Permission UI
  permissionText: {
    fontSize: 20, // Design system: titleMedium
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 28, // Design system: titleMedium
    textAlign: 'center',
    marginBottom: 20, // Design system: s5
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24, // Design system: s6
    paddingVertical: 12, // Design system: s3
    borderRadius: 16, // Design system: roundness
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 }, // Design system: elevation2
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4, // Design system: elevation2
    borderWidth: 1,
    borderColor: colors.outlineGrey,
  },
  permissionButtonText: {
    fontSize: 16, // Design system: bodyMedium
    fontWeight: '500',
    color: colors.textPrimary,
    lineHeight: 24, // Design system: bodyMedium
    textAlign: 'center',
  },
}); 