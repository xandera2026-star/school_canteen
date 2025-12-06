import { AuditEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { SubscriptionPlan } from '../enums';
export declare class SchoolSettingsEntity extends AuditEntity {
    schoolId: string;
    school: SchoolEntity;
    themePrimary?: string;
    themeAccent?: string;
    logoUrl?: string;
    cutoffTime?: string;
    timezone?: string;
    supportContact?: Record<string, unknown>;
    trialExpiresAt?: Date;
    subscriptionPlan: SubscriptionPlan;
}
