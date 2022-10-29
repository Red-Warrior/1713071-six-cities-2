import { Expose, Type } from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';
import { City } from '../../../types/city.type.js';
import { Location } from '../../../types/location.type.js';
import { HousingType } from '../../../types/housing-type.enum.js';
import { FeatureType } from '../../../types/feature-type.enum.js';
import { User } from '../../../types/user.type.js';

export default class OfferResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: string;

  @Expose()
  public city!: City;

  @Expose()
  public location!: Location;

  @Expose()
  public previewImage!: string;

  @Expose()
  public photos!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: HousingType;

  @Expose()
  public rooms!: number;

  @Expose()
  public guests!: number;

  @Expose()
  public price!: number;

  @Expose()
  public features!: FeatureType[];

  @Expose()
  public author!: User;

  @Expose()
  public numberOfComments!: number;

  @Expose({ name: 'userId' })
  @Type(() => UserResponse)
  public user!: UserResponse;
}
