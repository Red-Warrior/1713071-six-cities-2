import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import * as core from 'express-serve-static-core';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { fillDTO } from '../../utils/common.js';
import OfferResponse from './response/offer.response.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import CommentResponse from '../comment/response/comment.response.js';
import { ParamsChangeFavorites, ParamsGetOffer, ParamsGetUser, RequestQuery } from '../../types/request-query.type.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { DEFAULT_OFFER_COUNT } from './offer.constant.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto)
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:city/premium',
      method: HttpMethod.Get,
      handler: this.findPremiumOffers,
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.findFavorites,
    });
    this.addRoute({
      path: '/:offerId/:status',
      method: HttpMethod.Get,
      handler: this.changeFavorites,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferResponse, offer));
  }

  public async show(
    { params }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    this.ok(res, fillDTO(OfferResponse, offer));
  }

  public async findPremiumOffers(
    { query }: Request<core.ParamsDictionary | unknown, unknown, unknown, RequestQuery>,
    res: Response
  ) {
    if (!query.city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'City name is required',
        'OfferController'
      );
    }

    const offers = await this.offerService.findPremium(query.city);
    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async index(
    { query }: Request<core.ParamsDictionary | unknown, unknown, unknown, RequestQuery>,
    res: Response
  ) {
    const offers = await this.offerService.find(query.limit || DEFAULT_OFFER_COUNT);
    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async update(
    { body, params }: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);

    this.ok(res, fillDTO(OfferResponse, updatedOffer));
  }

  public async delete(
    { params }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    this.noContent(res, offer);
  }

  private async findFavorites(
    { params }: Request<core.ParamsDictionary | ParamsGetUser>,
    res: Response
  ) {
    const { userId } = params;
    const result = await this.offerService.findFavorites(userId);
    this.ok(res, fillDTO(OfferResponse, result));
  }

  private async changeFavorites(
    { params }: Request<core.ParamsDictionary | ParamsChangeFavorites>,
    res: Response
  ): Promise<void> {
    const { offerId, userId, status } = params;

    if (status) {
      await this.offerService.addToFavorites(offerId, userId);
    } else {
      await this.offerService.removeFromFavorites(offerId, userId);
    }
    const result = await this.offerService.findById(offerId, userId);
    this.ok(res, fillDTO(OfferResponse, result));
  }

  public async getComments(
    { params }: Request<core.ParamsDictionary | ParamsGetOffer, object, object>,
    res: Response
  ): Promise<void> {

    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
