export type RequestQuery = {
  limit?: number;
  city?: string;
}

export type ParamsGetOffer = {
  offerId: string;
}

export type ParamsGetUser = {
  userId: string;
}

export type ParamsFavoriteStatus = {
  status: boolean;
}

export type ParamsChangeFavorites = ParamsGetOffer & ParamsFavoriteStatus

