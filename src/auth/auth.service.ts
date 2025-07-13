import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Box, BoxDocument } from '../boxes/schemas/box.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Box.name) private boxModel: Model<BoxDocument>,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, username: string, password: string) {
    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new BadRequestException('Bu e-posta zaten kayıtlı.');
    }
    const user = new this.userModel({ name, email, username, password });
    try {
      await user.save();
    } catch (error) {
      if (error.code === 11000) {
        if (error.keyValue && error.keyValue.username) {
          throw new BadRequestException('Bu kullanıcı adı zaten kullanılmış.');
        }
        if (error.keyValue && error.keyValue.email) {
          throw new BadRequestException('Bu e-posta zaten kayıtlı.');
        }
      }
      throw error;
    }
    const token = this.jwtService.sign({ id: user._id, email: user.email });
    return { token, user: { id: user._id, name: user.name, email: user.email, username: user.username } };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await (user as any).comparePassword(password))) {
      throw new UnauthorizedException('E-posta veya şifre yanlış.');
    }
    const token = this.jwtService.sign({ id: user._id, email: user.email });
    return { token, user: { id: user._id, name: user.name, email: user.email, username: user.username } };
  }

  async validateUser(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) return null;

    const postsCount = await this.boxModel.countDocuments({ userId: id });
    const friendsCount = user.friends ? user.friends.length : 0;
    const collagesCount = 0; // Şimdilik 0

    const userObj = user.toObject();
    
    return { ...userObj, postsCount, friendsCount, collagesCount };
  }
}
