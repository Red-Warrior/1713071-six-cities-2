import { IsEmail, Length } from 'class-validator';
import { USER_CONSTANT } from '../user.constants.js';

const { MIN_PASSWORD, MAX_PASSWORD } = USER_CONSTANT;

export default class LoginUserDto {
  @IsEmail({}, { message: 'Email must be valid email address' })
  public email!: string;

  @Length(MIN_PASSWORD, MAX_PASSWORD, { message: `Minimum length of the name must be ${MIN_PASSWORD}, maximum length must be ${MAX_PASSWORD}` })
  public password!: string;
}
