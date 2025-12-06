import { UserRole } from '../enums/user-role.enum';
export declare class LoginRequestDto {
    mobile: string;
    country_code: string;
    school_id?: string;
    school_code?: string;
    user_type?: UserRole;
}
