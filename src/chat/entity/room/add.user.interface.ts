import { IUser } from '../../../user/entities/user.interface';
import { IRoom } from './room.interface';

export interface IMoveUser {
  user: IUser;
  room: IRoom;
}
