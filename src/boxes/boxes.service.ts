import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Box, BoxDocument } from './schemas/box.schema';

@Injectable()
export class BoxesService {
  constructor(@InjectModel(Box.name) private boxModel: Model<BoxDocument>) {}

  async create(data: Partial<Box>): Promise<Box> {
    const createdBox = new this.boxModel(data);
    return createdBox.save();
  }

  async findAll(): Promise<Box[]> {
    return this.boxModel.find().sort({ timestamp: -1 }).exec();
  }

  async deleteAll(): Promise<{ deletedCount?: number }> {
    const result = await this.boxModel.deleteMany({}).exec();
    return { deletedCount: result.deletedCount };
  }
}
