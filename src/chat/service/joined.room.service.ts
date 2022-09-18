import {Injectable, OnModuleInit} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {JoinedRoomEntity} from "../entity/joined.room/joined.room.entity";
import {Repository} from "typeorm";
import {IRoom} from "../entity/room/room.interface";
import {IJoinedRoom} from "../entity/joined.room/joined.room.interface";
import {IUser} from "../../user/entities/user.interface";

@Injectable()
export class JoinedRoomService implements OnModuleInit {
    constructor(
        @InjectRepository(JoinedRoomEntity) private readonly joinedRoomRepo: Repository<JoinedRoomEntity>
    ) {
    }

    async onModuleInit(): Promise<void> {
        await this.deleteAll()
    }

    public async create(joinedUser: IJoinedRoom): Promise<IJoinedRoom> {
        return this.joinedRoomRepo.save(joinedUser)
    }

    public async findByUser(user: IUser): Promise<IJoinedRoom[]> {
        return this.joinedRoomRepo.find({where: {users: user}})
    }

    public async findByRoom(room: IRoom): Promise<IJoinedRoom[]> {
        console.log(room)
        const res = await this.joinedRoomRepo.find({room})
        console.log(res)
        return res;
    }

    public async deleteBySocketId(socketId: string) {
        return this.joinedRoomRepo.delete({socketId})
    }

    private async deleteAll() {
        await this.joinedRoomRepo
            .createQueryBuilder()
            .delete()
            .execute()
    }
}
