export interface DatabaseConfig {
    url: string;
    logging: boolean;
}
export declare const databaseConfig: (() => DatabaseConfig) & import("@nestjs/config").ConfigFactoryKeyHost<DatabaseConfig>;
