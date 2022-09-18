import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'theemail@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform((param) => param.value.toLowerCase())
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'The password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
