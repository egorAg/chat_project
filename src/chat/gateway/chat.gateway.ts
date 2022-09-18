import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import {OnModuleInit, UnauthorizedException} from '@nestjs/common';
import { AuthService } from '../../auth/service/auth.service';
import { UserService } from '../../user/service/user.service';
import { IUser } from '../../user/entities/user.interface';
import { RoomService } from '../service/room.service';
import { UserConnectedService } from '../service/user.connected.service';
import { IRoom } from '../entity/room/room.interface';
import { IPage } from '../entity/room/page.interface';
import {JoinedRoomService} from "../service/joined.room.service";
import {IMessage} from "../entity/message/message.interface";
import {MessageService} from "../service/message.service";
import {Pagination} from "nestjs-typeorm-paginate";
import {IJoinedRoom} from "../entity/joined.room/joined.room.interface";
import {IMoveUser} from "../entity/room/add.user.interface";
import {inflate} from "zlib";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    private readonly userConnectedService: UserConnectedService,
    private readonly joinedRoomService: JoinedRoomService,
    private readonly messageService: MessageService
  ) {}

  async handleConnection(socket: Socket): Promise<boolean> {
    try {
      const token = await this.authService.verifyJwt(
        socket.handshake.headers.authorization.split(' ')[1],
      );
      const user: IUser = await this.userService.getOne(token.user.id);
      if (!user) {
        this.disconnect(socket);
      } else {
        socket.data.user = user;
        const rooms = await this.roomService.getRoomByUserId(user.id, {
          page: 1,
          limit: 10,
        });
        await this.userConnectedService.create({ socketId: socket.id, user });

        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch (e) {
      this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    await this.userConnectedService.deleteByUserId(socket.data.user.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket): void {
    socket.emit('error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  public async createRoom(socket: Socket, room: IRoom): Promise<void> {
    room.users = room.users ? room.users : [];
    const createdRoom: IRoom = await this.roomService.createRoom(
      room,
      socket.data.user,
    );

    for (const user of createdRoom.users) {
      const connection = await this.userConnectedService.findByUser(user);
      if (connection) {
        const rooms = await this.roomService.getRoomByUserId(user.id, {
          page: 1,
          limit: 10,
        });

        this.server.to(connection[0].socketId).emit('rooms', rooms);
      }
    }
  }

  @SubscribeMessage('paginateRoom')
  public async paginateRoom(socket: Socket, page: IPage): Promise<boolean> {
    page.limit = page.limit > 100 ? 100 : page.limit;

    const rooms = await this.roomService.getRoomByUserId(
      socket.data.user.id,
      page,
    );

    return this.server.to(socket.id).emit('rooms', rooms);
  }

  @SubscribeMessage('joinRoom')
  public async joinRoom(socket: Socket, room: IRoom) {
    const messages: Pagination<IMessage> = await this.messageService.findMessagesForRoom(room, {page: 1, limit: 10})

    await this.joinedRoomService.create({socketId: socket.id, users: socket.data.user, room: room})

    this.server.to(socket.id).emit('messages', messages)
  }

  @SubscribeMessage('leaveRoom')
  public async leaveRoom(socket: Socket) {
    await this.joinedRoomService.deleteBySocketId(socket.id)
  }

  @SubscribeMessage('addMessage')
  public async addMessage(socket: Socket, message: IMessage) {
    console.log(message)
    const createdMessage = await this.messageService.create({...message, user: socket.data.user})
    const room: IRoom = await this.roomService.getRoom(createdMessage.room.id)
    const users: IJoinedRoom[] = await this.joinedRoomService.findByRoom(room)

    for (const user of users) {
      this.server.to(user.socketId).emit('messageAdded', createdMessage)
    }
  }

  @SubscribeMessage('addUserToRoom')
  public async addUserToRoom(socket: Socket, data: IMoveUser) {
    const rooms = await this.roomService.addUserToRoom(data, {page: 1, limit: 10})
    const connections = await this.userConnectedService.findByUser(data.user)
    for (const connection of connections) {
      this.server.to(connection.socketId).emit('rooms', rooms)
    }
  }

  @SubscribeMessage('removeUserFromRoom')
  public async removeUserFromRoom(socket: Socket, data: IMoveUser) {
    const rooms = await this.roomService.removeUser(data, {page: 1, limit: 10})
    const connections = await this.userConnectedService.findByUser(data.user)
    for (const connection of connections) {
      this.server.to(connection.socketId).emit('rooms', rooms)
    }
  }
}
