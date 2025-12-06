"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const parent_module_1 = require("./modules/parent/parent.module");
const admin_module_1 = require("./modules/admin/admin.module");
const owner_module_1 = require("./modules/owner/owner.module");
const platform_module_1 = require("./modules/platform/platform.module");
const system_module_1 = require("./modules/system/system.module");
const database_config_1 = require("./config/database.config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [database_config_1.databaseConfig] }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [database_config_1.databaseConfig.KEY],
                useFactory: (dbConfig) => ({
                    type: 'postgres',
                    url: dbConfig.url,
                    autoLoadEntities: true,
                    synchronize: false,
                    logging: dbConfig.logging,
                }),
            }),
            auth_module_1.AuthModule,
            parent_module_1.ParentModule,
            admin_module_1.AdminModule,
            owner_module_1.OwnerModule,
            platform_module_1.PlatformModule,
            system_module_1.SystemModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map