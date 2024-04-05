import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '@modules/user/user.service';
import { UserController } from '@modules/user/user.controller';
import { User } from '@modules/user/entity/user.entity';
import { CacheModule } from '@nestjs/cache-manager';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    CacheModule.register(),
  ],
  controllers: [UserController],
  providers: [UserService, ]
})
export class UserModule { }
