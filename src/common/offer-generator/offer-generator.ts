import dayjs from 'dayjs';
import { MockData } from '../../types/mock-data.type.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/random.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';

enum MockConfig {
  MIN_RATING = 1,
  MAX_RATING = 2,
  MIN_ROOMS = 1,
  MAX_ROOMS = 10,
  MIN_GUESTS = 1,
  MAX_GUESTS = 10,
  MIN_PRICE = 100,
  MAX_PRICE = 100000,
  MIN_COMMENTS = 0,
  MAX_COMMENTS = 100,
  MIN_LATITUDE = 48,
  MAX_LATITUDE = 55,
  MIN_LONGITUDE = 2,
  MAX_LONGITUDE = 10,
  FIRST_MONTH = 1,
  LAST_MONTH = 12,
  FIRST_WEEK_DAY = 1,
  LAST_WEEK_DAY = 7
}

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {
  }

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const postDate = dayjs()
      .subtract(generateRandomValue(MockConfig.FIRST_WEEK_DAY, MockConfig.LAST_WEEK_DAY), 'day')
      .subtract(generateRandomValue(MockConfig.FIRST_MONTH, MockConfig.LAST_MONTH), 'month')
      .toISOString();
    const city = getRandomItem<string>(this.mockData.cities);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const photos = getRandomItem<string>(this.mockData.photos);
    const isPremium = Boolean(generateRandomValue(0, 1)).toString();
    const isFavorite = Boolean(generateRandomValue(0, 1)).toString();
    const rating = generateRandomValue(MockConfig.MIN_RATING, MockConfig.MAX_RATING - 1, 1).toString();
    const type = getRandomItem<string>(this.mockData.housingType);
    const rooms = generateRandomValue(MockConfig.MIN_ROOMS, MockConfig.MAX_ROOMS).toString();
    const guests = generateRandomValue(MockConfig.MIN_GUESTS, MockConfig.MAX_GUESTS).toString();
    const price = generateRandomValue(MockConfig.MIN_PRICE, MockConfig.MAX_PRICE).toString();
    const features = getRandomItems<string>(this.mockData.features).join(';');
    const numberOfComments = generateRandomValue(MockConfig.MIN_COMMENTS, MockConfig.MAX_COMMENTS);

    const userName = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const password = getRandomItem<string>(this.mockData.passwords);
    const userType = getRandomItem<string>(this.mockData.userTypes);

    const latitude = generateRandomValue(MockConfig.MIN_LATITUDE, MockConfig.MAX_LATITUDE, 6).toString();
    const longitude = generateRandomValue(MockConfig.MIN_LONGITUDE, MockConfig.MAX_LONGITUDE, 6).toString();

    return [
      title,
      description,
      postDate,
      city,
      latitude,
      longitude,
      previewImage,
      photos,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      features,
      userName,
      email,
      avatar,
      password,
      userType,
      numberOfComments
    ].join('\t');
  }
}
