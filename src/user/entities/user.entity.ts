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

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

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
