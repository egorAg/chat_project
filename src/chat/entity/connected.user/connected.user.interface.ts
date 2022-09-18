import { IUser } from '../../../user/entities/user.interface';

export interface IConnectedUser {
  id?: number;
  socketId: string;
  user: IUser;
}
