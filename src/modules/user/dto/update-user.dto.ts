import { Matches } from 'class-validator';

export default class UpdateUserDto {
  @Matches(/\.(jpg|png)$/, { message: 'Avatar image must be in jpg or png format' })
  public avatar?: string;
}
