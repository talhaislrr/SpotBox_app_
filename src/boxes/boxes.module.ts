import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Box, BoxSchema } from './schemas/box.schema';
import { BoxesService } from './boxes.service';
import { BoxesController } from './boxes.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Box.name, schema: BoxSchema }])],
  providers: [BoxesService],
  controllers: [BoxesController]
})
export class BoxesModule {}
