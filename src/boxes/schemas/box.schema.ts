import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BoxDocument = Box & Document;

@Schema()
export class Box {
  @Prop({ type: { latitude: Number, longitude: Number }, required: true })
  location: { latitude: number; longitude: number };

  @Prop({ type: [String], required: true })
  photos: string[];

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop()
  userId: string;

  @Prop()
  username: string;
}

export const BoxSchema = SchemaFactory.createForClass(Box); 