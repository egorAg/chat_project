import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUser } from '../../user/entities/user.interface';
import { ILoginResponse } from '../../user/entities/login.response.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async generateJwt(user: IUser): Promise<ILoginResponse> {
    const token = await this.jwtService.signAsync({ user });
    return <ILoginResponse>{
      refresh_token: user.currentHashedRefreshToken,
      access_token: token,
      token_type: 'jwt',
      expires_in: '12h',
    };
  }

  public async validatePassword(
    passwordFromInput: string,
    passwordFromDatabase: string,
  ): Promise<boolean> {
    return bcrypt.compare(passwordFromInput, passwordFromDatabase);
  }

  public async hashPassword(password: string): Promise<string> {
    return <string>bcrypt.hash(password, 12);
  }

  public async verifyJwt(jwt: string): Promise<any> {
    return this.jwtService.verifyAsync(jwt);
  }
}
