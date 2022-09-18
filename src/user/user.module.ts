import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserHelperProvider } from './service/providers/user.helper.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [UserService, UserHelperProvider],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_REFRESH || 'EATy5iUzex',
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
  exports: [UserService],
})
export class UserModule {}
