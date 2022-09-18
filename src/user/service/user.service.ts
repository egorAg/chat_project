import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from '../entities/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Like, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthService } from '../../auth/service/auth.service';
import { ILoginResponse } from '../entities/login.response.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  public async create(input: IUser): Promise<IUser> {
    const isExists = await this.mailExists(input.email);

    if (isExists)
      throw new HttpException('This email already in use', HttpStatus.CONFLICT);

    const hash = await this.authService.hashPassword(input.password);

    const newUser = await this.userRepo.save({ ...input, password: hash });

    return this.findOne(newUser.id);
  }

  public async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<UserEntity>> {
    return paginate(this.userRepo, options);
  }

  public async findByUsername(username: string): Promise<IUser[]> {
    return this.userRepo.find({
      where: {
        username: Like(`%${username.toLowerCase()}%`),
      },
    });
  }

  public async login(input: IUser): Promise<ILoginResponse> {
    const candidate = await this.findByEmail(input.email);

    if (!candidate)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isPasswordValid: boolean = await this.authService.validatePassword(
      input.password,
      candidate.password,
    );

    console.log(input.password);

    console.log(isPasswordValid);

    if (!isPasswordValid)
      throw new HttpException('Bad credentials', HttpStatus.UNAUTHORIZED);

    return this.authService.generateJwt(await this.findOne(candidate.id));
  }

  public async getOne(id: number): Promise<IUser> {
    return this.userRepo.findOneOrFail({ where: { id } });
  }

  private async mailExists(email: string): Promise<boolean> {
    const candidate = await this.userRepo.findOne({ where: { email } });

    return !!candidate;
  }

  private async findOne(id: number): Promise<IUser> {
    return this.userRepo.findOne({ where: { id } });
  }

  private async findByEmail(email: string): Promise<IUser> {
    return this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password'],
    });
  }
}
