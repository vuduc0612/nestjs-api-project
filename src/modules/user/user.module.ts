import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '@entity/user.entity';
import { UserService } from '@service/user.service';
import { UserController } from '@controller/user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({})
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
