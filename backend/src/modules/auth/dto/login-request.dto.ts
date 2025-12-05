import { IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  mobile: string;

  @IsString()
  country_code: string;
}
