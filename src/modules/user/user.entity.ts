import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { createSHA256 } from '../../utils/common.js';
import { User } from '../../types/user.type.js';
import { UserType } from '../../types/user-type.enum.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.name = data.name;
    this.email = data.email;
    this.avatar = data.avatar;
    this.password = data.password;
    this.type = data.type;
  }

  @prop({
    required: true,
    default: '',
    minlength: [1, 'Min length for name is 1'],
    maxlength: [15, 'Max length for name is 15'],
  })
  public name!: string;

  @prop({
    required: true,
    unique: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
  })
  public email!: string;

  @prop({
    default: 'default-avatar.jpg',
    match: [/\.(jpg|png)$/, 'The image must be in jpg or png format']
  })
  public avatar!: string;

  @prop({
    required: true,
    default: '',
  })
  public password!: string;

  @prop({
    required: true,
    default: 'Default',
    enum: UserType
  })
  public type!: UserType;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
