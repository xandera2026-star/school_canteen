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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const otp_service_1 = require("./otp.service");
const user_role_enum_1 = require("./enums/user-role.enum");
const entities_1 = require("../../database/entities");
let AuthService = AuthService_1 = class AuthService {
    otpService;
    jwtService;
    configService;
    parentRepository;
    schoolRepository;
    logger = new common_1.Logger(AuthService_1.name);
    otpBypassCode = process.env.OTP_BYPASS_CODE ?? '000000';
    constructor(otpService, jwtService, configService, parentRepository, schoolRepository) {
        this.otpService = otpService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.parentRepository = parentRepository;
        this.schoolRepository = schoolRepository;
    }
    sendOtp(payload) {
        const role = payload.user_type ?? user_role_enum_1.UserRole.PARENT;
        const channelKey = this.buildChannelKey(payload.mobile, role);
        const code = this.otpService.issue(channelKey);
        this.logger.debug(`OTP ${code} issued for ${channelKey}. (Use OTP_BYPASS_CODE=${this.otpBypassCode} for local testing)`);
        return {
            data: {
                message: `OTP sent to ${payload.country_code}${payload.mobile}`,
            },
        };
    }
    async verifyOtp(payload) {
        const role = payload.user_type ?? user_role_enum_1.UserRole.PARENT;
        const channelKey = this.buildChannelKey(payload.mobile, role);
        if (payload.otp !== this.otpBypassCode) {
            this.otpService.verify(channelKey, payload.otp);
        }
        switch (role) {
            case user_role_enum_1.UserRole.PARENT: {
                const parent = await this.resolveParent(payload);
                return this.issueTokens({
                    sub: parent.id,
                    roles: [user_role_enum_1.UserRole.PARENT],
                    schoolId: parent.schoolId,
                    mobile: parent.mobile,
                });
            }
            default: {
                throw new common_1.BadRequestException(`Role ${role} is not supported in the current release`);
            }
        }
    }
    async refreshTokens(refreshToken) {
        const refreshSecret = this.configService.get('REFRESH_SECRET', this.configService.get('JWT_SECRET', 'insecure-access-secret'));
        const decoded = await this.jwtService.verifyAsync(refreshToken, {
            secret: refreshSecret,
        });
        return this.issueTokens({
            sub: decoded.sub,
            roles: decoded.roles ?? [user_role_enum_1.UserRole.PARENT],
            schoolId: decoded.schoolId,
            mobile: decoded.mobile,
        });
    }
    buildChannelKey(mobile, role) {
        return `${role}:${mobile}`;
    }
    async resolveParent(payload) {
        let parent = await this.parentRepository.findOne({
            where: { mobile: payload.mobile },
        });
        const schoolId = await this.resolveSchoolIdentifier(payload.school_id, payload.school_code);
        if (!parent) {
            if (!schoolId) {
                throw new common_1.BadRequestException('school_id or school_code is required for parent onboarding');
            }
            parent = this.parentRepository.create({
                mobile: payload.mobile,
                schoolId,
                status: 'active',
            });
            parent = await this.parentRepository.save(parent);
        }
        else if (schoolId && parent.schoolId !== schoolId) {
            throw new common_1.BadRequestException('This parent is linked to a different school.');
        }
        return parent;
    }
    async resolveSchoolIdentifier(schoolId, schoolCode) {
        if (schoolId) {
            return schoolId;
        }
        if (!schoolCode) {
            return null;
        }
        const normalized = schoolCode.trim().toUpperCase();
        const school = await this.schoolRepository.findOne({
            where: { schoolCode: normalized },
        });
        if (!school) {
            throw new common_1.BadRequestException('Invalid school code provided.');
        }
        return school.id;
    }
    async issueTokens(payload) {
        const accessSecret = this.configService.get('JWT_SECRET', 'incredible-secret-key');
        const refreshSecret = this.configService.get('REFRESH_SECRET', accessSecret);
        const accessExpiresRaw = this.configService.get('JWT_EXPIRY', '3600s');
        const refreshExpiresRaw = this.configService.get('REFRESH_EXPIRY', '30d');
        const accessExpiresIn = this.parseExpiry(accessExpiresRaw);
        const refreshExpiresIn = this.parseExpiry(refreshExpiresRaw);
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ ...payload, typ: 'access' }, { secret: accessSecret, expiresIn: accessExpiresIn }),
            this.jwtService.signAsync({
                sub: payload.sub,
                roles: payload.roles,
                schoolId: payload.schoolId,
                mobile: payload.mobile,
                typ: 'refresh',
            }, { secret: refreshSecret, expiresIn: refreshExpiresIn }),
        ]);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: accessExpiresIn,
            roles: payload.roles,
        };
    }
    parseExpiry(expiresIn) {
        if (!expiresIn) {
            return 3600;
        }
        const match = /^([0-9]+)([smhd])?$/i.exec(expiresIn);
        if (!match) {
            return 3600;
        }
        const value = Number(match[1]);
        const unit = match[2] ?? 's';
        const multipliers = {
            s: 1,
            m: 60,
            h: 3600,
            d: 86400,
        };
        return value * (multipliers[unit] ?? 1);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.ParentEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.SchoolEntity)),
    __metadata("design:paramtypes", [otp_service_1.OtpService,
        jwt_1.JwtService,
        config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map