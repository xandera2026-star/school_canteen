import { IsOptional, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  mobile: string;

  @IsString()
  otp: string;

  @IsOptional()
  @IsString()
  device_id?: string;
}
