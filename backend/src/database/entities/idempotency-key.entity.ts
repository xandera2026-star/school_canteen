import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'idempotency_keys' })
export class IdempotencyKeyEntity {
  @PrimaryColumn({ name: 'key', type: 'text' })
  key: string;

  @Column({ name: 'school_id', type: 'uuid' })
  schoolId: string;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId?: string;

  @Column({ name: 'response_code', type: 'int', nullable: true })
  responseCode?: number;

  @Column({ name: 'response_body', type: 'jsonb', nullable: true })
  responseBody?: Record<string, unknown>;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt?: Date;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;
}
