import { ClassSerializerInterceptor, Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from './entities/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    @Get('me')
    getMe(@GetUser('') user: User){
        return user;
    }
}
