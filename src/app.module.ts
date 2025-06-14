// ** Nest Imports
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';

// ** Custom Module Imports
import { CoreModule } from './module/core.module';
import LoggerService from './global/util/logger/logger.service';
import { LoggingInterceptor } from './global/interceptor/LoggingInterceptor';

// ** Typeorm Imports
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from './global/repository/typeorm-ex.module';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

// ** Redis Imports
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ClsModule } from 'nestjs-cls';

// ** Utils Imports
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) => req.headers['X-Request-Id'] ?? uuidv4(),
      },
    }),
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: ['dist/module/**/*.entity.js'],
        synchronize: true,
        logging: true,
        logger: 'file',
        charset: 'utf8mb4_unicode_ci',
        timezone: '+09:00',
      }),
      async dataSourceFactory(option) {
        if (!option) throw new Error('Invalid options passed');

        return addTransactionalDataSource(new DataSource(option));
      },
    }),
    TypeOrmExModule,
    CoreModule,
  ],
  controllers: [],
  providers: [
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
