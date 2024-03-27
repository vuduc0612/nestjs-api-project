import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entity/user.entity';
import { AuthController } from '@controller/auth.controller';
import { AuthService } from '@service/auth.service';


@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
