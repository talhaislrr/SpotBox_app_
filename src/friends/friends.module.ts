import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequest, FriendRequestSchema } from './schemas/friend-request.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';

@Module({
  imports: [MongooseModule.forFeature([
    { name: FriendRequest.name, schema: FriendRequestSchema },
    { name: User.name, schema: UserSchema },
  ])],
  providers: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {} 