import { StyleSheet } from 'react-native';
import { colors, colorCombinations } from '../constants/colors';

export const chatScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backBlack,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16, // Design system: s4
    paddingTop: 16, // Design system: s4
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24, // Design system: s6
  },
  title: {
    fontSize: 24, // Design system: headlineSmall
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 32, // Design system: headlineSmall
    marginBottom: 4, // Design system: s1
  },
  
  // List Container
  listContainer: {
    flex: 1,
  },
  
  // Chat Card (Ana sohbet kartı) - Design system uyumlu
  chatCard: {
    backgroundColor: colors.surfaceGrey,
    borderRadius: 16, // Design system: roundness
    borderWidth: 1,
    borderColor: colors.outlineGrey,
    padding: 16, // Design system: s4
    marginBottom: 12, // Design system: s3
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 }, // Design system: elevation2
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // Design system: elevation2
  },
  chatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12, // Design system: s3
  },
  avatar: {
    width: 48, // Design system: min touch target
    height: 48, // Design system: min touch target
    backgroundColor: colors.primary,
    borderRadius: 24, // Half of 48 for perfect circle
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24, // Design system: headlineSmall
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 16, // Design system: s4
    height: 16, // Design system: s4
    borderRadius: 8,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.surfaceGrey,
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2, // Design system: elevation1
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 16, // Design system: bodyMedium
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 24, // Design system: bodyMedium
    marginBottom: 4, // Design system: s1
  },
  lastMessage: {
    fontSize: 16, // Design system: bodyMedium
    color: colors.textSecondary,
    fontWeight: '400',
    lineHeight: 24, // Design system: bodyMedium
  },
  chatMeta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 48, // Design system: min touch target
  },
  chatTime: {
    fontSize: 12, // Design system: labelSmall
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 16, // Design system: labelSmall
  },
  unreadBadge: {
    backgroundColor: colors.secondary,
    borderRadius: 16, // Design system: roundness
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8, // Design system: s2
    shadowColor: colors.secondary,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2, // Design system: elevation1
  },
  unreadCount: {
    fontSize: 12, // Design system: labelSmall
    fontWeight: '500',
    color: colors.textPrimary,
    lineHeight: 16, // Design system: labelSmall
  },
  
  // Empty State - Design system uyumlu
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32, // Design system: s8
  },
  emptyText: {
    fontSize: 20, // Design system: titleMedium
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 28, // Design system: titleMedium
    marginTop: 16, // Design system: s4
    marginBottom: 8, // Design system: s2
  },
  emptySubtext: {
    fontSize: 16, // Design system: bodyMedium
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 24, // Design system: bodyMedium
  },
  
  // Floating Action Button - Design system uyumlu
  fab: {
    position: 'absolute',
    bottom: 120, // Bottom navigation bar'ın yukarısında
    right: 16, // Design system: s4
    width: 56, // Chat screen için uygun boyut
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 }, // Design system: elevation2
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4, // Design system: elevation2
    borderWidth: 1,
    borderColor: colors.outlineGrey,
  },
}); 