import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FriendRequest, FriendRequestDocument } from './schemas/friend-request.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequestDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(from: string, to: string): Promise<FriendRequest> {
    if (from === to) {
      throw new BadRequestException('Kendinize arkadaş isteği gönderemezsiniz');
    }
    const existing = await this.friendRequestModel.findOne({ from, to }).exec();
    if (existing) {
      throw new BadRequestException('Daha önce istekte bulundunuz');
    }
    return this.friendRequestModel.create({ from, to });
  }
  /**
   * Kullanıcıya gelen bekleyen arkadaş isteklerini listeler.
   */
  async getIncoming(userId: string): Promise<FriendRequest[]> {
    return this.friendRequestModel
      .find({ to: userId, status: 'PENDING' })
      .populate('from', 'name username')
      .exec();
  }

  /**
   * Belirli isteği kabul eder ve iki kullanıcıyı arkadaş listesine ekler.
   */
  async accept(requestId: string, userId: string): Promise<void> {
    const request = await this.friendRequestModel.findById(requestId).exec();
    if (!request || request.to.toString() !== userId || request.status !== 'PENDING') {
      throw new NotFoundException('İstek bulunamadı veya yetkisiz');
    }
    // Arkadaşlık ekle
    await this.userModel.findByIdAndUpdate(userId, { $addToSet: { friends: request.from } });
    await this.userModel.findByIdAndUpdate(request.from, { $addToSet: { friends: userId } });
    request.status = 'ACCEPTED';
    await request.save();
  }

  /**
   * Belirli isteği reddeder.
   */
  async reject(requestId: string, userId: string): Promise<void> {
    const request = await this.friendRequestModel.findById(requestId).exec();
    if (!request || request.to.toString() !== userId || request.status !== 'PENDING') {
      throw new NotFoundException('İstek bulunamadı veya yetkisiz');
    }
    await this.friendRequestModel.findByIdAndDelete(requestId).exec();
  }
} 