import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../auth/service/auth.service';
import { UserService } from '../user/service/user.service';
import { IUser } from '../user/entities/user.interface';

export interface IRequest extends Request {
  user: IUser;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async use(req: IRequest, res: Response, next: NextFunction) {
    try {
      const tokensArray: string[] = req.headers['authorization'].split(' ');

      const decodeToken = await this.authService.verifyJwt(tokensArray[1]);

      const user: IUser = await this.userService.getOne(decodeToken.user.id);

      if (user) {
        req.user = user;

        next();
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch (e) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
