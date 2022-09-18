import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { ConnectedUserEntity } from '../entity/connected.user/connected.user.entity';
import { Repository } from 'typeorm';
import { IConnectedUser } from '../entity/connected.user/connected.user.interface';
import { IUser } from '../../user/entities/user.interface';

@Injectable()
export class UserConnectedService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepo: Repository<ConnectedUserEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.deleteAll();
  }

  async create(input: IConnectedUser): Promise<IConnectedUser> {
    return this.connectedUserRepo.save(input);
  }

  async findByUser(user: IUser): Promise<IConnectedUser[]> {
    return this.connectedUserRepo.find({ where: { user } });
  }

  async deleteByUserId(socketId: string) {
    return this.connectedUserRepo.delete({ socketId });
  }

  async deleteAll() {
    await this.connectedUserRepo.createQueryBuilder().delete().execute();
  }
}
