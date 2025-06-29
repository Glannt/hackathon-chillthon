import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'server-mysql',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'hackathon_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // Only for development - disable in production
  logging: process.env.NODE_ENV !== 'production',
  charset: 'utf8mb4',
  // collation: 'utf8mb4_unicode_ci',
  timezone: '+07:00',
  retryAttempts: 10,
  retryDelay: 3000,
  extra: {
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  },
};
