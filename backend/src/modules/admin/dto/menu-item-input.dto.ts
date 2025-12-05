import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { MenuCategoryType } from './menu-category-input.dto';

enum AvailabilityMode {
  DAILY = 'daily',
  DATE_RANGE = 'date_range',
  WEEKDAYS = 'weekdays',
}

class AvailabilityDto {
  @IsEnum(AvailabilityMode)
  mode: AvailabilityMode;

  @IsOptional()
  @IsArray()
  days?: string[];

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;
}

export class MenuItemInputDto {
  @IsUUID()
  category_id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  currency?: string = 'INR';

  @IsOptional()
  nutrition?: Record<string, unknown>;

  @IsOptional()
  allergens?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => AvailabilityDto)
  availability?: AvailabilityDto;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsEnum(MenuCategoryType)
  type_override?: MenuCategoryType;
}
