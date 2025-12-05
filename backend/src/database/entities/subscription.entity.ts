import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AuditEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { SubscriptionPlan } from '../enums';

@Entity({ name: 'subscriptions' })
export class SubscriptionEntity extends AuditEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'subscription_id' })
  id: string;

  @Column({ name: 'school_id', type: 'uuid' })
  schoolId: string;

  @ManyToOne(() => SchoolEntity, { onDelete: 'CASCADE' })
  school: SchoolEntity;

  @Column({ name: 'plan', type: 'enum', enum: SubscriptionPlan })
  plan: SubscriptionPlan;

  @Column({ name: 'status', type: 'text', default: 'active' })
  status: string;

  @Column({ name: 'started_at', type: 'timestamptz' })
  startedAt: Date;

  @Column({ name: 'ends_at', type: 'timestamptz', nullable: true })
  endsAt?: Date;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;
}
