import { IsNotEmpty } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  authorId: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;
}
