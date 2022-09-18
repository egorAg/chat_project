import { IUser } from '../../../user/entities/user.interface';
import { IRoom } from '../room/room.interface';

export interface IJoinedRoom {
  id?: number;
  socketId: string;
  users: IUser;
  room: IRoom;
}
