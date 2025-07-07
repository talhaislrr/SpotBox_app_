import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.textDark,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textLight,
  },
  // Tab navigation stilleri
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 4,
    marginHorizontal: 8,
  },
  focusedTabContainer: {
    backgroundColor: colors.primary + '15',
    transform: [{ scale: 1.1 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 3,
    borderColor: colors.white,
  },
  expandedButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  tabLogo: {
    width: 40,
    height: 40,
    tintColor: colors.white,
  },
}); 