import { Controller, Get, Post, Delete, Body, Req, UseGuards, UseInterceptors, UploadedFiles, HttpException, HttpStatus } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
// @ts-ignore
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BoxesService } from './boxes.service';

@Controller()
export class BoxesController {
  constructor(private readonly boxesService: BoxesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('boxes-upload')
  @UseInterceptors(FileFieldsInterceptor(
    [
      { name: 'front', maxCount: 1 },
      { name: 'back', maxCount: 1 },
    ],
    {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${Date.now()}-${file.fieldname}${ext}`);
        },
      }),
    },
  ))
  async uploadBox(@UploadedFiles() files: { front?: Express.Multer.File[]; back?: Express.Multer.File[] }, @Req() req: any) {
    const { front, back } = files;
    if (!front || !back) {
      throw new HttpException('Ön ve arka fotoğraf gerekli', HttpStatus.BAD_REQUEST);
    }
    const frontFile = front[0];
    const backFile = back[0];
    const host = `${req.protocol}://${req.get('host')}`;
    const photos = [
      `${host}/uploads/${frontFile.filename}`,
      `${host}/uploads/${backFile.filename}`,
    ];
    const { latitude, longitude } = req.body;
    return this.boxesService.create({
      location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
      photos,
      userId: req.user.id,
      username: req.user.email,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('boxes')
  findAll() {
    return this.boxesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('boxes')
  create(@Body() body: any) {
    const { location, photos, timestamp, userId, username } = body;
    return this.boxesService.create({ location, photos, timestamp, userId, username });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('boxes')
  deleteAll() {
    return this.boxesService.deleteAll();
  }
}
