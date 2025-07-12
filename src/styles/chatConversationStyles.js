import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export const chatConversationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backBlack,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineGrey,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  avatarContainer: {
    marginRight: 8,
    marginLeft: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 65,
    height: 65,
    borderRadius: 32,
  },
  userInfoContainer: {
    justifyContent: 'center',
    flex: 1,
    marginLeft: 8,
  },
  lastSeenText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  theirMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatarContainer: {
    marginRight: 8,
    marginBottom: 4,
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  myBubble: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  theirBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceGrey,
    borderWidth: 1,
    borderColor: colors.outlineGrey,
  },
  messageText: {
    color: colors.textPrimary,
    fontSize: 15,
  },
  timeText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.outlineGrey,
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceGrey,
    color: colors.textPrimary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});