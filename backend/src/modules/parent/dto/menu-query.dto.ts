import { IsDateString, IsUUID } from 'class-validator';

export class MenuQueryDto {
  @IsUUID()
  school_id: string;

  @IsDateString()
  service_date: string;
}
