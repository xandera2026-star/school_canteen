import { PlatformService } from './platform.service';
export declare class PlatformController {
    private readonly platformService;
    constructor(platformService: PlatformService);
    overview(): {
        data: {
            total_schools: number;
            total_orders: number;
            total_revenue: number;
            expiring_trials: never[];
            inactive_schools: never[];
        };
    };
}
