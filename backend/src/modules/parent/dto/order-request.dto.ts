import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class OrderItemDto {
  @IsUUID()
  menu_item_id: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferences?: string[];
}

export class OrderRequestDto {
  @IsOptional()
  @IsUUID()
  order_id?: string;

  @IsUUID()
  student_id: string;

  @IsDateString()
  service_date: string;

  @IsOptional()
  @IsString()
  special_instructions?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
