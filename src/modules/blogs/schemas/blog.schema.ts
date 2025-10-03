import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlodDocument = HydratedDocument<Blog>;

@Schema({ timestamps: true })
export class Blog {
  @Prop()
  author: string;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({ default: false })
  isApprove: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
