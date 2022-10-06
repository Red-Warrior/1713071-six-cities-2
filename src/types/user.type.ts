import { UserType } from './user-type.enum.js';

export type User = {
  firstname: string;
  lastname: string;
  email: string;
  avatar: string;
  password: string;
  type: UserType;
}
