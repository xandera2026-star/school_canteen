"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionDto = exports.SubscriptionPlan = void 0;
const class_validator_1 = require("class-validator");
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["TRIAL"] = "trial";
    SubscriptionPlan["STANDARD"] = "standard";
    SubscriptionPlan["PREMIUM"] = "premium";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
class SubscriptionDto {
    school_id;
    plan;
}
exports.SubscriptionDto = SubscriptionDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SubscriptionDto.prototype, "school_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(SubscriptionPlan),
    __metadata("design:type", String)
], SubscriptionDto.prototype, "plan", void 0);
//# sourceMappingURL=subscription.dto.js.map