import { OwnerService } from './owner.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { SubscriptionDto } from './dto/subscription.dto';
export declare class OwnerController {
    private readonly ownerService;
    constructor(ownerService: OwnerService);
    listSchools(): {
        data: {
            school_id: string;
            name: string;
            address: string;
            status: string;
            subscription: {
                plan: import("./dto/subscription.dto").SubscriptionPlan;
                status: string;
                trial_ends_at: string;
            };
        }[];
    };
    createSchool(payload: CreateSchoolDto): {
        data: {
            status: string;
            name: string;
            address: string;
            theme?: import("../admin/dto/theme-settings.dto").ThemeSettingsDto;
            school_id: string;
        };
    };
    updateSubscription(payload: SubscriptionDto): {
        data: {
            subscription_id: string;
            school_id: string;
            plan: import("./dto/subscription.dto").SubscriptionPlan;
            status: string;
        };
    };
}
