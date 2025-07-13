import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name) private convModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private msgModel: Model<MessageDocument>,
  ) {}

  async findOrCreateConversation(userId: string, participantId: string) {
    let conv = await this.convModel.findOne({ participants: { $all: [userId, participantId] } });
    if (!conv) {
      conv = new this.convModel({ participants: [userId, participantId] });
      await conv.save();
    }
    return conv;
  }

  async findConversations(userId: string) {
    return this.convModel
      .find({ participants: userId })
      .populate('participants', 'name username avatar')
      .exec();
  }

  async findMessages(conversationId: string) {
    return this.msgModel.find({ conversationId }).sort({ timestamp: 1 }).exec();
  }

  async sendMessage(conversationId: string, senderId: string, text: string) {
    const msg = new this.msgModel({ conversationId, senderId, text });
    return msg.save();
  }
}
