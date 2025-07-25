import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true });
    if (!updatedUser) {
      throw new NotFoundException('Kullanıcı bulunamadı.');
    }
    return updatedUser;
  }

  /**
   * Belirtilen kullanıcının arkadaş listesini döner.
   */
  async getFriends(userId: string): Promise<UserDocument[]> {
    const user = await this.userModel.findById(userId).populate('friends', 'name username');
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı.');
    }
    return (user.friends as unknown) as UserDocument[];
  }
}
