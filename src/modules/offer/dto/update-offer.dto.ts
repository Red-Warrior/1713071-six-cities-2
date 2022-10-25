import { City } from '../../../types/city.type.js';
import { Location } from '../../../types/location.type.js';
import { HousingType } from '../../../types/housing-type.enum.js';
import { FeatureType } from '../../../types/feature-type.enum.js';
import { User } from '../../../types/user.type.js';

export default class CreateOfferDto {
  title?: string;
  description?: string;
  postDate?: Date;
  city?: City;
  location?: Location;
  previewImage?: string;
  photos?: string[];
  isPremium?: boolean;
  isFavorite?: boolean;
  rating?: number;
  type?: HousingType;
  rooms?: number;
  guests?: number;
  price?: number;
  features?: FeatureType[];
  author?: User;
  numberOfComments?: number;
  public userId?: string;
}
