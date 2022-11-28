import { Expose } from 'class-transformer';

export default class UploadImagePreviewResponse {
  @Expose()
  public previewImage!: string;
}
