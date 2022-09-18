import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { RoomService } from './service/room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entity/room/room.entity';
import { UserConnectedService } from './service/user.connected.service';
import { ConnectedUserEntity } from './entity/connected.user/connected.user.entity';
import { JoinedRoomEntity } from './entity/joined.room/joined.room.entity';
import { MessageEntity } from './entity/message/message.entity';
import { JoinedRoomService } from './service/joined.room.service';
import { MessageService } from './service/message.service';

@Module({
  providers: [
    ChatGateway,
    RoomService,
    UserConnectedService,
    JoinedRoomService,
    MessageService,
  ],
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([
      RoomEntity,
      ConnectedUserEntity,
      JoinedRoomEntity,
      MessageEntity,
    ]),
  ],
})
export class ChatModule {}
