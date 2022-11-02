import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';

export interface OfferServiceInterface extends DocumentExistsInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;

  findById(offerId: string, userId?: string | undefined): Promise<DocumentType<OfferEntity> | null>;

  findPremium(city: string): Promise<DocumentType<OfferEntity>[]> | null

  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> | null

  addToFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>

  removeFromFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>

  find(limit: number, userId?: string | unknown): Promise<DocumentType<OfferEntity>[]>;

  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;

  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  updateRatingAndNumberOfComments(offerId: string): Promise<void>;

  exists(documentId: string): Promise<boolean>;
}
