import { IsOptional, IsString, IsUrl } from 'class-validator';

export class ThemeSettingsDto {
  @IsOptional()
  @IsString()
  primary_color?: string;

  @IsOptional()
  @IsString()
  accent_color?: string;

  @IsOptional()
  @IsUrl()
  logo_url?: string;
}
