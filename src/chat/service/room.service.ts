import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../entity/room/room.entity';
import { getRepository, Repository } from 'typeorm';
import { IRoom } from '../entity/room/room.interface';
import { IUser } from '../../user/entities/user.interface';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { IMoveUser } from '../entity/room/add.user.interface';
import { UserEntity } from '../../user/entities/user.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepo: Repository<RoomEntity>,
  ) {}

  public async createRoom(input: IRoom, creator: IUser): Promise<IRoom> {
    const newRoom = await this.addCreatorToRoom(input, creator);
    return this.roomRepo.save(newRoom);
  }

  public async getRoomByUserId(
    id: number,
    options: IPaginationOptions,
  ): Promise<Pagination<IRoom>> {
    const query = this.roomRepo
      .createQueryBuilder('room')
      .leftJoin('room.users', 'users')
      .where('users.id = :userId', { userId: id })
      .leftJoinAndSelect('room.users', 'all_users')
      .orderBy('room.updated_at', 'DESC');

    return paginate(query, options);
  }

  public async getRoom(roomId: number): Promise<IRoom> {
    return this.roomRepo.findOne({
      where: { id: roomId },
      relations: ['users'],
    });
  }

  public async addUserToRoom(
    input: IMoveUser,
    options: IPaginationOptions,
  ): Promise<Pagination<IRoom>> {
    const { id } = input.room;
    const room = await this.roomRepo.findOne({
      where: { id },
      relations: ['users'],
    });

    room.users.push(<UserEntity>input.user);

    await getRepository(RoomEntity).save(room);

    return paginate(this.roomRepo, options, {
      where: { id },
      relations: ['users'],
    });
  }

  async removeUser(input: IMoveUser, options: IPaginationOptions) {
    const { room, user } = input;
    const candidate = await this.roomRepo.findOne({
      where: { id: room.id },
      relations: ['users'],
    });

    candidate.users.filter((userItem) => userItem.id != user.id);

    await getRepository(RoomEntity).save(candidate);

    return paginate(this.roomRepo, options, {
      where: { id: room.id },
      relations: ['users'],
    });
  }

  private async addCreatorToRoom(room: IRoom, creator: IUser): Promise<IRoom> {
    room.users.push(creator);
    return room;
  }
}
