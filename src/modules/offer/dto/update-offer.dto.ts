import { City } from '../../../types/city.type.js';
import { HousingType } from '../../../types/housing-type.enum.js';
import { FeatureType } from '../../../types/feature-type.enum.js';
import { Type } from 'class-transformer';
import { OFFER_CONSTANT } from '../offer.constant.js';
import {
  IsOptional,
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsInt,
  Matches,
  Min,
  Max,
  MinLength,
  MaxLength,
  ValidateNested,
} from 'class-validator';

const {
  MIN_TITLE,
  MAX_TITLE,
  MIN_DESCRIPTION,
  MAX_DESCRIPTION,
  PHOTOS_LENGTH,
  MIN_ROOMS,
  MAX_ROOMS,
  MIN_GUESTS,
  MAX_GUESTS,
  MIN_PRICE,
  MAX_PRICE
} = OFFER_CONSTANT;

class Location {
  @IsNumber()
  public latitude!: number;

  @IsNumber()
  public longitude!: number;
}

export default class CreateOfferDto {
  @IsOptional()
  @MinLength(MIN_TITLE, { message: `Minimum length of the title must be ${MIN_TITLE}` })
  @MaxLength(MAX_TITLE, { message: `Maximum length of the title must be ${MAX_TITLE}` })
  public title?: string;

  @IsOptional()
  @MinLength(MIN_DESCRIPTION, { message: `Minimum length of the description must be ${MIN_DESCRIPTION}` })
  @MaxLength(MAX_DESCRIPTION, { message: `Maximum length of the description must be ${MAX_DESCRIPTION}` })
  public description?: string;

  @IsOptional()
  @IsEnum(City, { message: 'City must be Paris, Cologne, Brussels, Amsterdam, Hamburg or Dusseldorf' })
  public city?: City;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Location)
  public location?: Location;

  @IsOptional()
  @Matches(/\.(jpg|png)$/, { message: 'Preview image must be in jpg or png format' })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: 'Photos must be an array' })
  @ArrayMinSize(PHOTOS_LENGTH, { message: `Number of photos must be ${PHOTOS_LENGTH}` })
  @ArrayMaxSize(PHOTOS_LENGTH, { message: `Number of photos must be ${PHOTOS_LENGTH}` })
  @Matches(/\.(jpg|png)$/, { message: 'Photo must be in jpg or png format' })
  public photos?: string[];

  @IsOptional()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean()
  public isFavorite?: boolean;

  @IsOptional()
  @IsEnum(HousingType, { message: 'Type must be Apartment, House, Room or Hotel' })
  public type?: HousingType;

  @IsOptional()
  @IsInt({ message: 'Rooms must be an integer' })
  @Min(MIN_ROOMS, { message: `Minimum number of rooms is ${MIN_ROOMS}` })
  @Max(MAX_ROOMS, { message: `Maximum number of rooms is ${MAX_ROOMS}` })
  public rooms ?: number;

  @IsOptional()
  @IsInt({ message: 'Guests must be an integer' })
  @Min(MIN_GUESTS, { message: `Minimum number of rooms is ${MIN_GUESTS}` })
  @Max(MAX_GUESTS, { message: `Maximum number of rooms is ${MAX_GUESTS}` })
  public guests ?: number;

  @IsOptional()
  @IsInt({ message: 'Price must be an integer' })
  @Min(MIN_PRICE, { message: `Minimum price must be ${MIN_PRICE}` })
  @Max(MAX_PRICE, { message: `Maximum price must be ${MAX_PRICE}` })
  public price ?: number;

  @IsOptional()
  @IsArray({ message: 'Feature must be an array' })
  @IsEnum(FeatureType, { message: 'Feature must be from suggested list' })
  public features ?: FeatureType[];
}
