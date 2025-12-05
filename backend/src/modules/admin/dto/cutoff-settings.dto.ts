import { IsString } from 'class-validator';

export class CutoffSettingsDto {
  @IsString()
  cutoff_time: string;

  @IsString()
  timezone: string;
}
