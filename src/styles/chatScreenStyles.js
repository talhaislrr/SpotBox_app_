import { StyleSheet } from 'react-native';
import { colors, colorCombinations } from '../constants/colors';

export const chatScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backBlack,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  
  // List Container
  listContainer: {
    flex: 1,
  },
  
  // Chat Card (Ana sohbet kartı) - Dark Theme
  chatCard: {
    backgroundColor: colors.surfaceGrey,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outlineGrey,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    fontSize: 32,
    width: 48,
    height: 48,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: colors.primary,
    borderRadius: 24,
    overflow: 'hidden',
    color: colors.textPrimary,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.surfaceGrey,
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '400',
    lineHeight: 18,
  },
  chatMeta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 48,
  },
  chatTime: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    shadowColor: colors.secondary,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  
  // Empty State - Dark Theme
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
  },
  
  // Floating Action Button - Neon Gradient
  fab: {
    position: 'absolute',
    bottom: 730, // Bottom navigation bar'ın üstüne taşıdık
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.outlineGrey,
  },
}); 