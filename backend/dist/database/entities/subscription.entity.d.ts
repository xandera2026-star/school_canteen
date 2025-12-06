import { AuditEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { SubscriptionPlan } from '../enums';
export declare class SubscriptionEntity extends AuditEntity {
    id: string;
    schoolId: string;
    school: SchoolEntity;
    plan: SubscriptionPlan;
    status: string;
    startedAt: Date;
    endsAt?: Date;
    metadata?: Record<string, unknown>;
}
