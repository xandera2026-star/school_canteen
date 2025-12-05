import { Injectable } from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  sendOtp(payload: LoginRequestDto) {
    // TODO: integrate Firebase/OTP provider
    return {
      data: { message: `OTP sent to ${payload.country_code}${payload.mobile}` },
    };
  }

  verifyOtp(payload: VerifyOtpDto): AuthResponseDto {
    // TODO: verify OTP via Firebase/custom provider
    const role = payload.mobile.endsWith('10') ? 'parent' : 'school_admin';
    return {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      roles: [role],
    };
  }

  refreshTokens(refreshToken: string): AuthResponseDto {
    // TODO: validate refresh token and issue new tokens
    return {
      access_token: 'mock-access-token',
      refresh_token: refreshToken,
      expires_in: 3600,
      roles: ['parent'],
    };
  }
}
