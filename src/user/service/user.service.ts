import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from '../entities/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { getRepository, Like, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthService } from '../../auth/service/auth.service';
import { ILoginResponse } from '../entities/login.response.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  public async create(input: IUser): Promise<IUser> {
    const isExists = await this.mailExists(input.email);

    if (isExists)
      throw new HttpException('This email already in use', HttpStatus.CONFLICT);

    const hash = await this.authService.hashPassword(input.password);

    const token = await this.jwtService.signAsync({
      email: input.email,
      username: input.username,
    });

    const newUser = await this.userRepo.save({
      ...input,
      password: hash,
      currentHashedRefreshToken: token,
    });

    return this.findOne(newUser.id);
  }

  public async refresh(token: string) {
    await this.jwtService.verify(token);

    const data = await (<IUser>this.jwtService.decode(token));

    const candidate = await this.userRepo.findOne({
      where: { email: data.email },
    });

    if (!candidate)
      throw new HttpException('Bad token, re-login', HttpStatus.CONFLICT);

    candidate.currentHashedRefreshToken = await this.jwtService.signAsync({
      ...candidate,
    });

    await getRepository(UserEntity).save({ ...candidate });

    return this.authService.generateJwt(
      await this.getOneWithToken(candidate.id),
    );
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

    if (!isPasswordValid)
      throw new HttpException('Bad credentials', HttpStatus.UNAUTHORIZED);

    return this.authService.generateJwt(
      await this.getOneWithToken(candidate.id),
    );
  }

  public async getOne(id: number): Promise<IUser> {
    return this.userRepo.findOneOrFail({ where: { id } });
  }

  private async mailExists(email: string): Promise<boolean> {
    const candidate = await this.userRepo.findOne({ where: { email } });

    return !!candidate;
  }

  private async findOne(id: number): Promise<IUser> {
    return this.userRepo.findOne({ where: { id }, select: [] });
  }

  private getOneWithToken(id: number) {
    return this.userRepo.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'username',
        'password',
        'currentHashedRefreshToken',
      ],
    });
  }

  private async findByEmail(email: string): Promise<IUser> {
    return this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password'],
    });
  }
}
