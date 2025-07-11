import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createConversation(@Body('participantId') participantId: string, @Req() req: any) {
    return this.chatService.findOrCreateConversation(req.user.id, participantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getConversations(@Req() req: any) {
    return this.chatService.findConversations(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/messages')
  getMessages(@Param('id') id: string) {
    return this.chatService.findMessages(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/messages')
  sendMessage(@Param('id') id: string, @Body('text') text: string, @Req() req: any) {
    return this.chatService.sendMessage(id, req.user.id, text);
  }
}
