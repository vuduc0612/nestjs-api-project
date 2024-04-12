import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/user/entity/user.entity';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthService } from '@modules/auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from '@modules/auth/consumer/mail.consumer';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './cronjob/cronjob.service';
import { CacheModule } from '@nestjs/cache-manager';


@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([User]),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow('MAIL_HOST'), 
          secure: false,
          //port: configService.getOrThrow('MAIL_PORT'), 
          auth: {
            user: configService.getOrThrow('MAIL_USER'), 
            pass: configService.getOrThrow('MAIL_PASSWORD'), 
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: 'email-queue',
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: 'localhost',//configService.getOrThrow('REDIS_HOST'),
          port: 6379,//configService.getOrThrow('REDIS_PORT')
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    CacheModule.register()
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailConsumer, TasksService]
})
export class AuthModule { }
