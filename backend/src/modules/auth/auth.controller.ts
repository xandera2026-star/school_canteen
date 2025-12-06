import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  login(@Body() payload: LoginRequestDto) {
    return this.authService.sendOtp(payload);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() payload: VerifyOtpDto): Promise<AuthResponseDto> {
    return this.authService.verifyOtp(payload);
  }

  @Post('refresh')
  async refresh(@Body() payload: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refreshTokens(payload.refresh_token);
  }
}
