import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class LoginRequestDto {
  @IsString()
  mobile: string;

  @IsString()
  country_code: string;

  @IsOptional()
  @IsUUID()
  school_id?: string;

  @IsOptional()
  @IsEnum(UserRole)
  user_type?: UserRole;
}
