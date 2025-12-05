import { UserRole } from '../enums/user-role.enum';

export interface UserPayload {
  sub: string;
  roles: UserRole[];
  schoolId?: string;
  mobile?: string;
  typ?: 'access' | 'refresh';
}
