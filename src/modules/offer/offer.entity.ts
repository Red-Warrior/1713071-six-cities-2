import typegoose, { defaultClasses, getModelForClass, Ref, Severity } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { City } from '../../types/city.type.js';
import { Location } from '../../types/location.type.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { FeatureType } from '../../types/feature-type.enum.js';

const { prop, modelOptions } = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {

  @prop({
    trim: true,
    required: true,
    minlength: [10, 'Min length for title is 10'],
    maxlength: [100, 'Max length for title is 100'],
  })
  public title!: string;

  @prop({
    trim: true,
    required: true,
    minlength: [20, 'Min length for description is 20'],
    maxlength: [1024, 'Max length for description is 1024'],
  })
  public description!: string;

  @prop({ required: true })
  public postDate!: Date;

  @prop({
    required: true,
    enum: City
  })
  public city!: City;

  @prop({
    required: true,
    allowMixed: Severity.ALLOW
  })
  public location!: Location;

  @prop({ required: true })
  public previewImage!: string;

  @prop({
    required: true,
    type: () => [String],
    validate: {
      validator: (photosList: string[]) => photosList.length === 6,
      message: 'Incorrect number of photos, six photos are required.'
    }
  })
  public photos!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public isFavourites!: boolean;

  @prop({
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: (ratingRow: number) => {
        const rating = ratingRow.toString();

        if (!rating.includes('.') && !rating.includes(',')) {
          return true;
        }
        return rating.split(rating.includes('.') ? '.' : ',')[1].length === 1;
      },
      message: 'Only one decimal place is allowed.'
    }
  })
  public rating!: number;

  @prop({
    required: true,
    enum: HousingType
  })
  public type!: HousingType;

  @prop({
    required: true,
    min: 1,
    max: 8,
  })
  public rooms!: number;

  @prop({
    required: true,
    min: 1,
    max: 10
  })
  public guests!: number;

  @prop({
    required: true,
    min: 100,
    max: 10000
  })
  public price!: number;

  @prop({
    required: true,
    type: () => [String],
    enum: FeatureType,
  })
  public features!: FeatureType[];

  @prop({
    required: true,
    ref: UserEntity,
  })
  public userId!: Ref<UserEntity>;

  @prop({ default: 0 })
  public numberOfComments!: number;
}

export const OfferModel = getModelForClass(OfferEntity);
