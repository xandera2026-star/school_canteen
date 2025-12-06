"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const config_1 = require("@nestjs/config");
exports.databaseConfig = (0, config_1.registerAs)('database', () => {
    const url = process.env.DATABASE_URL ?? 'postgres://localhost:5432/xandera';
    return {
        url,
        logging: process.env.TYPEORM_LOGGING === 'true',
    };
});
//# sourceMappingURL=database.config.js.map