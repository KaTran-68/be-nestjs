import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schemas/course.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = await this.courseModel.create(createCourseDto);
    return course;
  }

  async findAll() {
    return this.courseModel.find();
  }

  async findOne(slug: string) {
    return await this.courseModel.findOne({ slug });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    return await this.courseModel.updateOne(
      { _id: id },
      { ...updateCourseDto },
    );
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return this.courseModel.deleteOne({ _id: id });
    } else {
      throw new BadRequestException('Invalid Id');
    }
  }
}
