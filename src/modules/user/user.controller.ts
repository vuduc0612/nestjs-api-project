import { 
    ClassSerializerInterceptor, 
    Controller, 
    Get, 
    UseGuards, 
    UseInterceptors 
} from '@nestjs/common';
import { User } from '@entity/user.entity';
import { AuthGuard } from '@guard/auth.guard';
import { GetUser } from '@decorator/get-user.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    @Get('me')
    getMe(@GetUser('') user: User){
        return user;
    }
}
