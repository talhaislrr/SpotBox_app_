import { StyleSheet } from 'react-native';
import { colors, colorCombinations } from '../constants/colors';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backBlack,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  // Tab navigation stilleri - Dark Theme
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 4,
    marginHorizontal: 8,
    backgroundColor: colors.surfaceGrey,
    borderWidth: 1,
    borderColor: colors.outlineGrey,
  },
  focusedTabContainer: {
    backgroundColor: colorCombinations.interactions.hover,
    transform: [{ scale: 1.1 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderColor: colors.primary,
  },
  tabTransition: {
    transition: 'all 0.3s ease-in-out',
  },
  animatedButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  profileButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceGrey,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  expandedButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 16,
    borderWidth: 3,
  },
  tabLogo: {
    width: 40,
    height: 40,
    tintColor: colors.textPrimary,
  },
}); 