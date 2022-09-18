import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    type: String,
    example: 'Some token',
  })
  refresh_token: string;

  @ApiProperty({
    type: String,
    example: 'Some token',
  })
  access_token: string;

  @ApiProperty({
    type: String,
    example: 'jwt',
  })
  token_type: string;

  @ApiProperty({
    type: String,
    example: '12h',
  })
  expires_in: string;
}
