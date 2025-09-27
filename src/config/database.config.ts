import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get<string>('database.url'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: configService.get<string>('nodeEnv') === 'development',
  logging: configService.get<string>('nodeEnv') === 'development',
  ssl:
    configService.get<string>('nodeEnv') === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
