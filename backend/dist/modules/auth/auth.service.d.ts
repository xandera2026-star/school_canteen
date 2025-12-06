import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from './dto/login-request.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { OtpService } from './otp.service';
import { ParentEntity, SchoolEntity } from '../../database/entities';
export declare class AuthService {
    private readonly otpService;
    private readonly jwtService;
    private readonly configService;
    private readonly parentRepository;
    private readonly schoolRepository;
    private readonly logger;
    private readonly otpBypassCode;
    constructor(otpService: OtpService, jwtService: JwtService, configService: ConfigService, parentRepository: Repository<ParentEntity>, schoolRepository: Repository<SchoolEntity>);
    sendOtp(payload: LoginRequestDto): {
        data: {
            message: string;
        };
    };
    verifyOtp(payload: VerifyOtpDto): Promise<AuthResponseDto>;
    refreshTokens(refreshToken: string): Promise<AuthResponseDto>;
    private buildChannelKey;
    private resolveParent;
    private resolveSchoolIdentifier;
    private issueTokens;
    private parseExpiry;
}
