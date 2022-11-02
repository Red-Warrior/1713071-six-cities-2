import { inject, injectable } from 'inversify';
import { OfferServiceInterface } from './offer-service.interface.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { DEFAULT_PREMIUM_OFFER_COUNT } from './offer.constant.js';
import { SortType } from '../../types/sort-type.enum.js';
import { Types } from 'mongoose';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['userId'])
      .exec();
  }

  public async find(limit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .sort({ createAt: SortType.Down })
      .limit(limit)
      .populate(['userId'])
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['userId'])
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        '$inc': {
          numberOfComments: 1,
        }
      }).exec();
  }

  public async findPremium(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ isPremium: true, city })
      .sort({ createAt: SortType.Down })
      .limit(DEFAULT_PREMIUM_OFFER_COUNT)
      .populate(['userId'])
      .exec();
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ isFavorite: true, userId })
      .sort({ createAt: SortType.Down })
      .limit(DEFAULT_PREMIUM_OFFER_COUNT)
      .populate(['userId'])
      .exec();
  }

  public async addToFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findByIdAndUpdate(
      offerId,
      { $push: { favorites: userId } },
      { new: true }
    );
  }

  public async removeFromFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findByIdAndUpdate(
      offerId,
      { $pull: { favorites: userId } },
      { new: true }
    );
  }

  public async updateRatingAndNumberOfComments(offerId: string): Promise<void> {
    const result = await this.offerModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(offerId)
        }
      },
      {
        $lookup: {
          from: 'comments',
          let: { offerId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
            { $project: { rating: 1 } },
          ],
          as: 'comments',
        },
      },
      {
        $addFields: {
          id: { $toString: '$_id' },
          commentCount: { $size: '$comments' },
          rating: {
            $cond: [
              { $eq: [{ $size: '$comments' }, 0] },
              0,
              { $round: [{ $divide: [{ $sum: '$comments.rating' }, { $size: '$comments' }] }, 1] },
            ],
          }
        },
      }
    ]).exec();

    await this.offerModel.populate(result, { path: 'userId' });
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({ _id: documentId })) !== null;
  }
}
