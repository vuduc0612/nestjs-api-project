import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { User } from '@modules/user/entity/user.entity';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { GetUser } from '@modules/auth/decorator/get-user.decorator';
import { UserInterceptor } from '@modules/user/interceptor/user.interceptor';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { UserService } from '@modules/user/user.service';


@Controller('users')
export class UserController {
    constructor(private userService: UserService,
               ) { }

    @UseGuards(AuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('me')
    getMe(@GetUser('') user: User) {
        //console.log(user);
        return user;
    }
    @UseInterceptors(UserInterceptor, CacheInterceptor)
    @Get('all')
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }
   
}

