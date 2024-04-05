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


@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'sandbox.smtp.mailtrap.io',//configService.getOrThrow('MAIL_HOST'),//'sandbox.smtp.mailtrap.io', // Sử dụng host của Mailtrap
          port: 2525, // Sử dụng port của Mailtrap
          auth: {
            user: '24c2c9d6fd4047', // SMTP username từ Mailtrap
            pass: '65ae62cd0b4307', // SMTP password từ Mailtrap
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'email-queue',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailConsumer, TasksService]
})
export class AuthModule { }
