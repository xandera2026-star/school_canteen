import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { SubscriptionDto, SubscriptionPlan } from './dto/subscription.dto';

@Injectable()
export class OwnerService {
  listSchools() {
    return {
      data: [
        {
          school_id: 'school-1',
          name: 'SVMHSS FOOD COURT',
          address: 'Pallavaram Road, Kolapakkam, Chennai',
          status: 'trial',
          subscription: {
            plan: SubscriptionPlan.TRIAL,
            status: 'trial',
            trial_ends_at: new Date().toISOString(),
          },
        },
      ],
    };
  }

  createSchool(payload: CreateSchoolDto) {
    return {
      data: {
        school_id: 'new-school',
        ...payload,
        status: 'trial',
      },
    };
  }

  updateSubscription(payload: SubscriptionDto) {
    return {
      data: {
        subscription_id: 'sub-1',
        school_id: payload.school_id,
        plan: payload.plan,
        status: payload.plan === SubscriptionPlan.TRIAL ? 'trial' : 'active',
      },
    };
  }
}
