import { City } from './city.type.js';
import { Location } from './location.type.js';
import { HousingType } from './housing-type.enum.js';
import { FeatureType } from './feature-type.enum.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City,
  location: Location,
  previewImage: string,
  photos: string[],
  isPremium: boolean,
  isFavourites: boolean,
  rating: number,
  type: HousingType,
  rooms: number,
  guests: number,
  price: number,
  features: FeatureType[],
  author: User,
  numberOfComments: number,
}
