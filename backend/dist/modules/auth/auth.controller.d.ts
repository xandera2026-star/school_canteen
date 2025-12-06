import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(payload: LoginRequestDto): {
        data: {
            message: string;
        };
    };
    verifyOtp(payload: VerifyOtpDto): Promise<AuthResponseDto>;
    refresh(payload: RefreshTokenDto): Promise<AuthResponseDto>;
}
