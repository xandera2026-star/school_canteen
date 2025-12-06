"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerService = void 0;
const common_1 = require("@nestjs/common");
const subscription_dto_1 = require("./dto/subscription.dto");
let OwnerService = class OwnerService {
    listSchools() {
        return {
            data: [
                {
                    school_id: 'school-1',
                    name: 'Saraswathi Vidyalaya Secondary School',
                    address: 'Pallavaram Road, Kolapakkam, Chennai',
                    status: 'trial',
                    subscription: {
                        plan: subscription_dto_1.SubscriptionPlan.TRIAL,
                        status: 'trial',
                        trial_ends_at: new Date().toISOString(),
                    },
                },
            ],
        };
    }
    createSchool(payload) {
        return {
            data: {
                school_id: 'new-school',
                ...payload,
                status: 'trial',
            },
        };
    }
    updateSubscription(payload) {
        return {
            data: {
                subscription_id: 'sub-1',
                school_id: payload.school_id,
                plan: payload.plan,
                status: payload.plan === subscription_dto_1.SubscriptionPlan.TRIAL ? 'trial' : 'active',
            },
        };
    }
};
exports.OwnerService = OwnerService;
exports.OwnerService = OwnerService = __decorate([
    (0, common_1.Injectable)()
], OwnerService);
//# sourceMappingURL=owner.service.js.map