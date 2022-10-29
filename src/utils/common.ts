import crypto from 'crypto';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Offer } from '../types/offer.type.js';
import { HousingType } from '../types/housing-type.enum.js';
import { FeatureType } from '../types/feature-type.enum.js';
import { City } from '../types/city.type.js';
import { UserType } from '../types/user-type.enum.js';

export const createOffer = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    title, description, postDate, city, latitude, longitude, previewImage, photos,
    isPremium, isFavorite, rating, type, rooms, guests, price, features, name,
    email, avatar, password, userType, numberOfComments
  ] = tokens;
  return {
    title,
    description,
    postDate: new Date(postDate),
    city: city as City,
    location: {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    },
    previewImage,
    photos: photos.split(';'),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: parseInt(rating, 10),
    type: type as HousingType,
    rooms: parseInt(rooms, 10),
    guests: parseInt(guests, 10),
    price: parseFloat(price),
    features: features.split(';').map((feature) => feature as FeatureType),
    author: {
      name,
      email,
      avatar,
      password,
      type: userType as UserType,
    },
    numberOfComments: numberOfComments && parseInt(numberOfComments, 10),
  } as Offer;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDTO = <T, V>(responseObject: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(responseObject, plainObject, { excludeExtraneousValues: true });

export const createErrorObject = (message: string) => ({
  error: message,
});
