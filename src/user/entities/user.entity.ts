import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomEntity } from '../../chat/entity/room/room.entity';
import { ConnectedUserEntity } from '../../chat/entity/connected.user/connected.user.entity';
import { JoinedRoomEntity } from '../../chat/entity/joined.room/joined.room.entity';
import { MessageEntity } from '../../chat/entity/message/message.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'user',
})
export class UserEntity {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: String,
    example: 'Some string',
  })
  @Column()
  username: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false, nullable: true })
  currentHashedRefreshToken: string;

  @ManyToMany(() => RoomEntity, (room) => room.users)
  rooms: RoomEntity[];

  @OneToMany(() => ConnectedUserEntity, (connection) => connection.user)
  connections: ConnectedUserEntity[];

  @OneToMany(() => JoinedRoomEntity, (room) => room.room)
  joinedRoom: JoinedRoomEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];
  @BeforeInsert()
  @BeforeUpdate()
  dataToLowerCase() {
    this.email = this.email.toLowerCase();
    this.username = this.password.toLowerCase();
  }
}
