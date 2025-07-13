import { Controller, Post, Param, Request, UseGuards, Get, Patch, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FriendsService } from './friends.service';

@Controller('friend-requests')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':toUserId')
  create(@Param('toUserId') toUserId: string, @Request() req) {
    const fromUserId = req.user.id;
    return this.friendsService.create(fromUserId, toUserId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  getIncoming(@Request() req) {
    return this.friendsService.getIncoming(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/accept')
  accept(@Param('id') requestId: string, @Request() req) {
    return this.friendsService.accept(requestId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  reject(@Param('id') requestId: string, @Request() req) {
    return this.friendsService.reject(requestId, req.user.id);
  }
} 