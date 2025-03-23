import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
      renderPath: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const typeOrmConfig =
          configService.get<TypeOrmModuleOptions>('typeorm');

        if (!typeOrmConfig) {
          throw new Error('TypeORM configuration is missing');
        }

        return typeOrmConfig;
      },
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
