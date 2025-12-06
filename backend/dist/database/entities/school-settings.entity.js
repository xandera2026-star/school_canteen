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
exports.SchoolSettingsEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const school_entity_1 = require("./school.entity");
const enums_1 = require("../enums");
let SchoolSettingsEntity = class SchoolSettingsEntity extends base_entity_1.AuditEntity {
    schoolId;
    school;
    themePrimary;
    themeAccent;
    logoUrl;
    cutoffTime;
    timezone;
    supportContact;
    trialExpiresAt;
    subscriptionPlan;
};
exports.SchoolSettingsEntity = SchoolSettingsEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'school_id', type: 'uuid' }),
    __metadata("design:type", String)
], SchoolSettingsEntity.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => school_entity_1.SchoolEntity, (school) => school.settings, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'school_id' }),
    __metadata("design:type", school_entity_1.SchoolEntity)
], SchoolSettingsEntity.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'theme_primary', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SchoolSettingsEntity.prototype, "themePrimary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'theme_accent', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SchoolSettingsEntity.prototype, "themeAccent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'logo_url', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SchoolSettingsEntity.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cutoff_time', type: 'time with time zone', nullable: true }),
    __metadata("design:type", String)
], SchoolSettingsEntity.prototype, "cutoffTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'timezone', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SchoolSettingsEntity.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'support_contact', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SchoolSettingsEntity.prototype, "supportContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trial_expires_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SchoolSettingsEntity.prototype, "trialExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'subscription_plan',
        type: 'enum',
        enum: enums_1.SubscriptionPlan,
        default: enums_1.SubscriptionPlan.TRIAL,
    }),
    __metadata("design:type", String)
], SchoolSettingsEntity.prototype, "subscriptionPlan", void 0);
exports.SchoolSettingsEntity = SchoolSettingsEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'school_settings' })
], SchoolSettingsEntity);
//# sourceMappingURL=school-settings.entity.js.map