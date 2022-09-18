import { Injectable } from '@nestjs/common';
import { UserCreateDto } from '../../entities/dto/user.create.dto';
import { IUser } from '../../entities/user.interface';
import { UserLoginDto } from '../../entities/dto/user.login.dto';

@Injectable()
export class UserHelperProvider {
  createUserDtoToEntity(dto: UserCreateDto): IUser {
    return <IUser>{
      email: dto.email,
      username: dto.username,
      password: dto.password,
    };
  }

  loginUserDtoToEntity(dto: UserLoginDto): IUser {
    return {
      email: dto.email,
      password: dto.password,
    };
  }
}
