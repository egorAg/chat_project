import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../entity/message/message.entity';
import { Repository } from 'typeorm';
import { IMessage } from '../entity/message/message.interface';
import { IRoom } from '../entity/room/room.interface';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
  ) {}

  public async create(input: IMessage): Promise<IMessage> {
    return this.messageRepo.save(input);
  }

  public async findMessagesForRoom(
    room: IRoom,
    options: IPaginationOptions,
  ): Promise<Pagination<IMessage>> {
    return paginate(this.messageRepo, options, {
      room,
      relations: ['user', 'room'],
    });
  }
}
