import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { IUser } from '../entities/user.interface';
import { UserCreateDto } from '../entities/dto/user.create.dto';
import { UserHelperProvider } from '../service/providers/user.helper.provider';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserLoginDto } from '../entities/dto/user.login.dto';
import { ILoginResponse } from '../entities/login.response.interface';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userHelperProvider: UserHelperProvider,
  ) {}

  @Post('create')
  public async createUser(@Body() dto: UserCreateDto): Promise<IUser> {
    const iUser = this.userHelperProvider.createUserDtoToEntity(dto);

    return this.userService.create(iUser);
  }

  @Get()
  public async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<IUser>> {
    limit = limit > 100 ? 100 : limit;

    return this.userService.findAll({
      page,
      limit,
      route: 'http://localhost:5001/user',
    });
  }

  @Post('login')
  public async login(@Body() dto: UserLoginDto): Promise<ILoginResponse> {
    const iUser = this.userHelperProvider.loginUserDtoToEntity(dto);

    return this.userService.login(iUser);
  }

  @Get('findByUserName')
  async findAllByUserName(
    @Query('username') username: string,
  ): Promise<IUser[]> {
    return this.userService.findByUsername(username);
  }

  @Post('refresh')
  async refresh(@Query('token') token: string) {
    return this.userService.refresh(token);
  }
}
