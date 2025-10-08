import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schemas/blog.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private blogModel: Model<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const { author, authorId, title, content, isDraft } = createBlogDto;
    const blog = await this.blogModel.create({
      author,
      authorId,
      title,
      content,
      isDraft,
    });
    return {
      _id: blog._id,
    };
  }

  async findAll(
    query: string,
    current: number,
    pageSize: number,
    isApproved: boolean,
  ) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    filter.isDraft = false;
    filter.isApproved = isApproved;

    const totalItems = (await this.blogModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;
    const results = await this.blogModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any);
    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      results,
    };
  }

  async findMyBlog(
    query: string,
    current: number,
    pageSize: number,
    authorId: string,
    isDraft: boolean,
  ) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    filter.authorId = authorId;
    filter.isDraft = isDraft;

    const totalItems = (await this.blogModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;
    const results = await this.blogModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any);
    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      results,
    };
  }

  async findOne(slug: string) {
    return await this.blogModel.findOne({ slug });
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    return await this.blogModel.updateOne({ _id: id }, { ...updateBlogDto });
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return await this.blogModel.deleteOne({ _id: id });
    } else {
      throw new BadRequestException('Invalid Id');
    }
  }

  async approveBlog(id: string) {
    return await this.blogModel.updateOne({ _id: id }, { isApproved: true });
  }
}
