import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FriendRequestDocument = FriendRequest & Document;

@Schema({ toJSON: { virtuals: true } })
export class FriendRequest {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  from: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  to: MongooseSchema.Types.ObjectId;

  @Prop({ default: 'PENDING' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest); 