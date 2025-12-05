import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum MenuCategoryType {
  VEG = 'veg',
  NON_VEG = 'non_veg',
  SNACKS = 'snacks',
  SOUTH_INDIAN = 'south_indian',
  NORTH_INDIAN = 'north_indian',
  SPECIAL = 'special',
  DRINKS = 'drinks',
}

export class MenuCategoryInputDto {
  @IsString()
  name: string;

  @IsEnum(MenuCategoryType)
  type: MenuCategoryType;

  @IsOptional()
  @IsString()
  description?: string;
}
