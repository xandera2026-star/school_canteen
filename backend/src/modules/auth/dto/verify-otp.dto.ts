import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class VerifyOtpDto {
  @IsString()
  mobile: string;

  @IsString()
  otp: string;

  @IsOptional()
  @IsString()
  device_id?: string;

  @IsOptional()
  @IsUUID()
  school_id?: string;

  @IsOptional()
  @IsEnum(UserRole)
  user_type?: UserRole;
}
