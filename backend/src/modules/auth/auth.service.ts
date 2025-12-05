import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from './dto/login-request.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { OtpService } from './otp.service';
import { UserRole } from './enums/user-role.enum';
import { ParentEntity } from '../../database/entities';
import { UserPayload } from './interfaces/user-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly otpBypassCode = process.env.OTP_BYPASS_CODE ?? '000000';

  constructor(
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(ParentEntity)
    private readonly parentRepository: Repository<ParentEntity>,
  ) {}

  sendOtp(payload: LoginRequestDto) {
    const role = payload.user_type ?? UserRole.PARENT;
    const channelKey = this.buildChannelKey(payload.mobile, role);
    const code = this.otpService.issue(channelKey);
    this.logger.debug(
      `OTP ${code} issued for ${channelKey}. (Use OTP_BYPASS_CODE=${this.otpBypassCode} for local testing)`,
    );
    return {
      data: {
        message: `OTP sent to ${payload.country_code}${payload.mobile}`,
      },
    };
  }

  async verifyOtp(payload: VerifyOtpDto): Promise<AuthResponseDto> {
    const role = payload.user_type ?? UserRole.PARENT;
    const channelKey = this.buildChannelKey(payload.mobile, role);
    if (payload.otp !== this.otpBypassCode) {
      this.otpService.verify(channelKey, payload.otp);
    }

    switch (role) {
      case UserRole.PARENT: {
        const parent = await this.resolveParent(payload);
        return this.issueTokens({
          sub: parent.id,
          roles: [UserRole.PARENT],
          schoolId: parent.schoolId,
          mobile: parent.mobile,
        });
      }
      default: {
        throw new BadRequestException(
          `Role ${role} is not supported in the current release`,
        );
      }
    }
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponseDto> {
    const refreshSecret = this.configService.get<string>(
      'REFRESH_SECRET',
      this.configService.get<string>('JWT_SECRET', 'insecure-access-secret'),
    );
    const decoded = await this.jwtService.verifyAsync<UserPayload>(
      refreshToken,
      {
        secret: refreshSecret,
      },
    );

    return this.issueTokens({
      sub: decoded.sub,
      roles: decoded.roles ?? [UserRole.PARENT],
      schoolId: decoded.schoolId,
      mobile: decoded.mobile,
    });
  }

  private buildChannelKey(mobile: string, role: UserRole) {
    return `${role}:${mobile}`;
  }

  private async resolveParent(payload: VerifyOtpDto) {
    let parent = await this.parentRepository.findOne({
      where: { mobile: payload.mobile },
    });
    if (!parent) {
      if (!payload.school_id) {
        throw new BadRequestException(
          'school_id is required for parent onboarding',
        );
      }
      parent = this.parentRepository.create({
        mobile: payload.mobile,
        schoolId: payload.school_id,
        status: 'active',
      });
      parent = await this.parentRepository.save(parent);
    }
    return parent;
  }

  private async issueTokens(payload: UserPayload): Promise<AuthResponseDto> {
    const accessSecret = this.configService.get<string>(
      'JWT_SECRET',
      'insecure-access-secret',
    );
    const refreshSecret = this.configService.get<string>(
      'REFRESH_SECRET',
      accessSecret,
    );
    const accessExpiresIn = this.configService.get<string>(
      'JWT_EXPIRY',
      '3600s',
    );
    const refreshExpiresIn = this.configService.get<string>(
      'REFRESH_EXPIRY',
      '30d',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload, typ: 'access' },
        { secret: accessSecret, expiresIn: accessExpiresIn },
      ),
      this.jwtService.signAsync(
        {
          sub: payload.sub,
          roles: payload.roles,
          schoolId: payload.schoolId,
          mobile: payload.mobile,
          typ: 'refresh',
        },
        { secret: refreshSecret, expiresIn: refreshExpiresIn },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.parseExpiry(accessExpiresIn),
      roles: payload.roles,
    };
  }

  private parseExpiry(expiresIn: string): number {
    const match = /^([0-9]+)([smhd])?$/.exec(expiresIn);
    if (!match) {
      return 3600;
    }
    const value = Number(match[1]);
    const unit = match[2] ?? 's';
    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };
    return value * (multipliers[unit] ?? 1);
  }
}
