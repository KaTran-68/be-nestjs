import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import slugify from 'slugify';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ timestamps: true })
export class Blog {
  @Prop()
  author: string;

  @Prop()
  authorId: string;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ default: false })
  isDraft: boolean;

  @Prop({ unique: true })
  slug: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.pre<BlogDocument>('save', async function (next) {
  if (this.isModified('title')) {
    const blogModel = this.constructor as Model<BlogDocument>;
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (await blogModel.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }
  next();
});
