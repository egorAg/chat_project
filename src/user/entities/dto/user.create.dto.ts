import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  @Transform((param) => param.value.toLowerCase())
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform((param) => param.value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
