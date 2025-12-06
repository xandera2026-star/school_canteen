"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllergyFlag = exports.MenuCategoryType = exports.PaymentStatus = exports.OrderStatus = exports.SubscriptionPlan = void 0;
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["TRIAL"] = "trial";
    SubscriptionPlan["STANDARD"] = "standard";
    SubscriptionPlan["PREMIUM"] = "premium";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["CONFIRMED"] = "confirmed";
    OrderStatus["PREPARING"] = "preparing";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var MenuCategoryType;
(function (MenuCategoryType) {
    MenuCategoryType["VEG"] = "veg";
    MenuCategoryType["NON_VEG"] = "non_veg";
    MenuCategoryType["SNACKS"] = "snacks";
    MenuCategoryType["SOUTH_INDIAN"] = "south_indian";
    MenuCategoryType["NORTH_INDIAN"] = "north_indian";
    MenuCategoryType["SPECIAL"] = "special";
    MenuCategoryType["DRINKS"] = "drinks";
})(MenuCategoryType || (exports.MenuCategoryType = MenuCategoryType = {}));
var AllergyFlag;
(function (AllergyFlag) {
    AllergyFlag["NUTS"] = "nuts";
    AllergyFlag["GLUTEN"] = "gluten";
    AllergyFlag["LACTOSE"] = "lactose";
    AllergyFlag["SPICY"] = "spicy";
})(AllergyFlag || (exports.AllergyFlag = AllergyFlag = {}));
//# sourceMappingURL=index.js.map