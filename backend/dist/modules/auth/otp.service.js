"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
let OtpService = class OtpService {
    cache = new Map();
    ttlMs = Number(process.env.OTP_TTL_MS ?? 5 * 60 * 1000);
    issue(channelKey) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        this.cache.set(channelKey, { code, expiresAt: Date.now() + this.ttlMs });
        return code;
    }
    verify(channelKey, otp) {
        const entry = this.cache.get(channelKey);
        if (!entry || entry.code !== otp || entry.expiresAt < Date.now()) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        this.cache.delete(channelKey);
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)()
], OtpService);
//# sourceMappingURL=otp.service.js.map