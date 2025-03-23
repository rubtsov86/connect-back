import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: process.env.DATABASE_TYPE as 'mysql' | 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'rubtsov1986',
  database: process.env.DATABASE_NAME || 'connect',
  autoLoadEntities: !!process.env.DATABASE_AUTO_LOAD_ENTITES,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: process.env.DATABASE_SYNCHRONIZE_ENTITES === 'true',
  migrationsDir: './src/migrations',
  cli: {
    migrationsDir: './src/migrations',
  },
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
