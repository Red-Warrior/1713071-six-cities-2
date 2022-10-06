import { readFileSync } from 'fs';
import { Offer } from '../../types/offer.type.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { FileReaderInterface } from './file-reader.interface.js';
import { FeatureType } from '../../types/feature-type.enum.js';
import { City } from '../../types/city.type.js';
import { UserType } from '../../types/user-type.enum.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) {
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf8'});
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map((
        [
          title,
          description,
          postDate,
          city,
          latitude,
          longitude,
          previewImage,
          photos,
          isPremium,
          isFavourites,
          rating,
          type,
          rooms,
          guests,
          price,
          features,
          firstname,
          lastname,
          email,
          avatar,
          password,
          userType,
          numberOfComments
        ]) => ({
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
        isFavourites: isFavourites === 'true',
        rating: parseInt(rating, 10),
        type: type as HousingType,
        rooms: parseInt(rooms, 10),
        guests: parseInt(guests, 10),
        price: parseFloat(price),
        features: features.split(';').map((feature) => feature as FeatureType),
        author: {
          firstname,
          lastname,
          email,
          avatar,
          password,
          type: userType as UserType,
        },
        numberOfComments: parseInt(numberOfComments, 10),
      }));
  }
}
