import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import slugify from 'slugify';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ unique: true })
  slug: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.pre<CourseDocument>('save', async function (next) {
  if (this.isModified('name')) {
    const courseModel = this.constructor as Model<CourseDocument>;
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (await courseModel.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }
  next();
});
