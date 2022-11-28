import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import * as core from 'express-serve-static-core';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { OfferServiceInterface } from './offer-service.interface.js';
import { fillDTO } from '../../utils/common.js';
import OfferResponse from './response/offer.response.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import CommentResponse from '../comment/response/comment.response.js';
import { ParamsChangeFavorites, ParamsGetOffer, ParamsGetUser, RequestQuery } from '../../types/request-query.type.js';
import { DEFAULT_OFFER_COUNT } from './offer.constant.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.middleware.js';
import UploadImagePreviewResponse from './response/upload-preview-image.response.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger, configService);

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
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });

    this.addRoute({
      path: '/:offerId/previewImage',
      method: HttpMethod.Post,
      handler: this.uploadPreviewImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'previewImage'),
      ]
    });

    this.addRoute({
      path: '/:offerId/photos',
      method: HttpMethod.Post,
      handler: this.uploadPhotos,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'photos'),
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
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.findPremiumByCity,
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.findFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });

    this.addRoute({
      path: '/:offerId/:status',
      method: HttpMethod.Post,
      handler: this.changeFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const { body, user } = req;
    const offer = await this.offerService.create({ ...body, userId: user.id });
    const result = fillDTO(OfferResponse, offer);
    this.ok(res, { ...result, rating: 0, numberOfComments: 0 });
  }

  public async index(
    req: Request<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, RequestQuery>,
    res: Response
  ): Promise<void> {
    const { limit } = req.query;
    const offers = await this.offerService.find(limit || DEFAULT_OFFER_COUNT, req.user?.id);
    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async show(
    req: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { params: { offerId } } = req;
    const offer = await this.offerService.findById(offerId, req.user?.id);

    this.ok(res, fillDTO(OfferResponse, offer));
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

  public async findPremiumByCity(
    req: Request<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, RequestQuery>,
    res: Response
  ): Promise<void> {
    const { city } = req.query;
    if (!city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'City name is required',
        'OfferController'
      );
    }

    const offers = await this.offerService.findPremiumByCity(city, req.user?.id);
    this.ok(res, fillDTO(OfferResponse, offers));
  }

  private async findFavorites(
    req: Request<core.ParamsDictionary | ParamsGetUser>,
    res: Response
  ): Promise<void> {
    const { userId } = req.params;
    const result = await this.offerService.findFavorites(userId);
    this.ok(res, fillDTO(OfferResponse, result));
  }

  private async changeFavorites(
    req: Request<core.ParamsDictionary | ParamsChangeFavorites>,
    res: Response
  ): Promise<void> {
    const { offerId, status } = req.params;
    const { user } = req;


    if (status) {
      await this.offerService.addToFavorites(offerId, user.id);
    } else {
      await this.offerService.removeFromFavorites(offerId, user.id);
    }
    const result = await this.offerService.findById(offerId, user.id);
    this.ok(res, fillDTO(OfferResponse, result));
  }

  private async uploadPreviewImage(
    req: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { offerId } = req.params;
    const uploadFile = { previewImage: req.file?.filename };
    await this.offerService.updateById(offerId, uploadFile);
    this.ok(res, fillDTO(UploadImagePreviewResponse, uploadFile));
  }

  private async uploadPhotos(
    req: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { offerId } = req.params;
    const files = [...JSON.parse(JSON.stringify(req.files))];
    const photos = files.map((file) => file.filename);
    const uploadFiles = { photos };
    await this.offerService.updateById(offerId, uploadFiles);
    this.ok(res, uploadFiles);
  }

  public async getComments(
    req: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { offerId } = req.params;
    const comments = await this.commentService.findByOfferId(offerId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
