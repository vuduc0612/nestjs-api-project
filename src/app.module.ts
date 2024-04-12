import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from '@modules/user/user.module';
import { TodoModule } from '@modules/todo/todo.module';
import { DatabaseModule } from './base/database/database.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthGuard } from './modules/auth/guard/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entity/user.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User]),
    TodoModule,
    UserModule,
    DatabaseModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    Reflector,
  ],
})
export class AppModule { }
