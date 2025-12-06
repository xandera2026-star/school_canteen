import { UserRole } from '../enums/user-role.enum';
export declare class VerifyOtpDto {
    mobile: string;
    otp: string;
    device_id?: string;
    school_id?: string;
    school_code?: string;
    user_type?: UserRole;
}
