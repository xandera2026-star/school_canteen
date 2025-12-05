import { IsOptional, IsString } from 'class-validator';
import { ThemeSettingsDto } from '../../admin/dto/theme-settings.dto';

export class CreateSchoolDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsOptional()
  theme?: ThemeSettingsDto;
}
