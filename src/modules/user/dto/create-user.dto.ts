import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';
import { UserType } from '../../../types/user-type.enum.js';
import { USER_CONSTANT } from '../user.constants.js';

const { MIN_USERNAME, MAX_USERNAME, MIN_PASSWORD, MAX_PASSWORD } = USER_CONSTANT;

export default class CreateUserDto {
  @IsString({ message: 'User name is required' })
  @Length(MIN_USERNAME, MAX_USERNAME,
    { message: `Minimum length of the name must be ${MIN_USERNAME}, maximum length must be ${MAX_USERNAME}` })
  public name!: string;

  @IsEmail({}, { message: 'Email must be valid email address' })
  public email!: string;

  @Matches(/\.(jpg|png)$/, { message: 'Avatar image must be in jpg or png format' })
  public avatar!: string;

  @Length(MIN_PASSWORD, MAX_PASSWORD,
    { message: `Minimum length of the name must be ${MIN_PASSWORD}, maximum length must be ${MAX_PASSWORD}` })
  public password!: string;

  @IsEnum(UserType, { message: 'User type must be Default or Pro' })
  public type!: UserType;
}
