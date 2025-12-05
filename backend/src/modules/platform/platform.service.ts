import { Injectable } from '@nestjs/common';

@Injectable()
export class PlatformService {
  overview() {
    return {
      data: {
        total_schools: 12,
        total_orders: 18234,
        total_revenue: 1234990,
        expiring_trials: [],
        inactive_schools: [],
      },
    };
  }
}
