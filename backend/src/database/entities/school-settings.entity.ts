import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { AuditEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { SubscriptionPlan } from '../enums';

@Entity({ name: 'school_settings' })
export class SchoolSettingsEntity extends AuditEntity {
  @PrimaryColumn({ name: 'school_id', type: 'uuid' })
  schoolId: string;

  @OneToOne(() => SchoolEntity, (school) => school.settings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'school_id' })
  school: SchoolEntity;

  @Column({ name: 'theme_primary', type: 'text', nullable: true })
  themePrimary?: string;

  @Column({ name: 'theme_accent', type: 'text', nullable: true })
  themeAccent?: string;

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl?: string;

  @Column({ name: 'cutoff_time', type: 'time with time zone', nullable: true })
  cutoffTime?: string;

  @Column({ name: 'timezone', type: 'text', nullable: true })
  timezone?: string;

  @Column({ name: 'support_contact', type: 'jsonb', nullable: true })
  supportContact?: Record<string, unknown>;

  @Column({ name: 'trial_expires_at', type: 'timestamptz', nullable: true })
  trialExpiresAt?: Date;

  @Column({
    name: 'subscription_plan',
    type: 'enum',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.TRIAL,
  })
  subscriptionPlan: SubscriptionPlan;
}
