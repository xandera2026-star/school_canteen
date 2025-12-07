import { IsDateString, IsOptional } from 'class-validator';

export class OrderQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
