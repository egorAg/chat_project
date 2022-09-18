import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { IUser } from '../entities/user.interface';
import { UserCreateDto } from '../entities/dto/user.create.dto';
import { UserHelperProvider } from '../service/providers/user.helper.provider';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserLoginDto } from '../entities/dto/user.login.dto';
import { ILoginResponse } from '../entities/login.response.interface';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { LoginResponseDto } from '../entities/dto/login.response.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userHelperProvider: UserHelperProvider,
  ) {}

  @ApiOperation({
    description: 'create new user',
  })
  @ApiBody({
    type: UserCreateDto,
  })
  @ApiOkResponse({
    type: UserEntity,
  })
  @Post('create')
  public async createUser(@Body() dto: UserCreateDto): Promise<IUser> {
    const iUser = this.userHelperProvider.createUserDtoToEntity(dto);

    return this.userService.create(iUser);
  }

  @ApiOperation({
    description: 'get all users',
  })
  @ApiQuery({
    type: Number,
    name: 'page',
    required: false,
    description: 'This is validation request, default value for page is 1',
  })
  @ApiQuery({
    type: Number,
    name: 'limit',
    required: false,
    description: 'This is validation request, default value for limit is 10',
  })
  @ApiOkResponse({
    type: [UserEntity],
  })
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

  @ApiOperation({
    description: 'Login',
  })
  @ApiBody({
    type: UserLoginDto,
  })
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @Post('login')
  public async login(@Body() dto: UserLoginDto): Promise<ILoginResponse> {
    const iUser = this.userHelperProvider.loginUserDtoToEntity(dto);

    return this.userService.login(iUser);
  }

  @ApiOperation({
    description:
      'Find user by username, uses method LIKE() from typeorm, for example, to find user ADMIN you can send ADM or IN',
  })
  @ApiQuery({
    type: String,
    name: 'username',
    required: true,
  })
  @ApiOkResponse({
    type: [UserEntity],
  })
  @Get('findByUserName')
  async findAllByUserName(
    @Query('username') username: string,
  ): Promise<IUser[]> {
    return this.userService.findByUsername(username);
  }

  @ApiOperation({
    description: 'Use this endpoint to update tokens',
  })
  @ApiQuery({
    name: 'token',
    required: true,
  })
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @Post('refresh')
  async refresh(@Query('token') token: string) {
    return this.userService.refresh(token);
  }
}
