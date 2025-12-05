import { IsString } from 'class-validator';

export class UploadRequestDto {
  @IsString()
  mime_type: string;

  @IsString()
  folder: string;
}
