import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class MenuQueryDto {
  @IsOptional()
  @IsUUID()
  school_id: string;

  @IsDateString()
  service_date: string;
}
