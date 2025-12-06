export declare enum SubscriptionPlan {
    TRIAL = "trial",
    STANDARD = "standard",
    PREMIUM = "premium"
}
export declare class SubscriptionDto {
    school_id: string;
    plan: SubscriptionPlan;
}
