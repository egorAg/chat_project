import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ChatModule } from './chat/chat.module';
import {LoggingMiddleware} from "./middleware/logging.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL || 'postgres://user:password@localhost:5432/db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ChatModule,
    CacheModule.register({
      ttl: 60 * 60 * 12,
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: 'user/create',
          method: RequestMethod.POST,
        },
        {
          path: 'user/login',
          method: RequestMethod.POST,
        },
        {
          path: 'user/refresh',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('');

      consumer.apply(LoggingMiddleware)
          .forRoutes('')
  }
}
