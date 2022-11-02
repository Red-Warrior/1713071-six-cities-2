import { IsMongoId, IsString, IsNumber, Length, Min, Max } from 'class-validator';

export default class CreateCommentDto {
  @IsString({ message: 'Comment text must be a string' })
  @Length(5, 1024,
    { message: 'Min length of the comment text must be 5, max length must be 1024' }
  )
  public text!: string;

  @IsNumber({}, { message: 'Rating is required' })
  @Min(1, { message: 'Min rating must be 1' })
  @Max(5, { message: 'Max rating must be 5' })
  public rating!: number;

  @IsMongoId({ message: 'OfferId field must be a valid id' })
  public offerId!: string;

  public userId!: string;
}
