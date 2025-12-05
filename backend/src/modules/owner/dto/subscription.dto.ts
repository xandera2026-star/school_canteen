import { IsEnum, IsUUID } from 'class-validator';

export enum SubscriptionPlan {
  TRIAL = 'trial',
  STANDARD = 'standard',
  PREMIUM = 'premium',
}

export class SubscriptionDto {
  @IsUUID()
  school_id: string;

  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;
}
