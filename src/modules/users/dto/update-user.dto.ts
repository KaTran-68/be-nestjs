import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsMongoId({ message: '_id khong hop le' })
  @IsNotEmpty()
  _id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  address: string;

  @IsOptional()
  image: string;
}

export class ChangePasswordUserDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  email: string;
}
