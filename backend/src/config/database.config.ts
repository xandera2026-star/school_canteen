import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  url: string;
  logging: boolean;
}

export const databaseConfig = registerAs('database', (): DatabaseConfig => {
  const url = process.env.DATABASE_URL ?? 'postgres://localhost:5432/xandera';
  return {
    url,
    logging: process.env.TYPEORM_LOGGING === 'true',
  };
});
