import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { Request } from 'express';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  // @Public()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req: any, file: any, callback: any) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    const imagePath = file.path;
    return this.coursesService.create({ ...createCourseDto, image: imagePath });
  }

  @Get()
  // @Public()
  async findAll(@Req() req: Request) {
    const res = await this.coursesService.findAll();

    const host = `${req.protocol}://${req.headers.host}`;

    return res.map((course) => ({
      _id: course.id,
      name: course.name,
      description: course.description,
      image: course.image ? `${host}/${course.image}` : null,
      slug: course.slug,
    }));
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string, @Req() req: Request) {
    const host = `${req.protocol}://${req.headers.host}`;

    const course = await this.coursesService.findOne(slug);
    return {
      _id: course.id,
      name: course.name,
      description: course.description,
      image: course.image ? `${host}/${course.image}` : null,
      slug: course.slug,
    };
  }

  @Patch(':id')
  // @Public()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req: any, file: any, callback: any) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const dataToUpdate = { ...updateCourseDto };

    if (file) {
      dataToUpdate.image = file.path;
    }

    return this.coursesService.update(id, dataToUpdate);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
