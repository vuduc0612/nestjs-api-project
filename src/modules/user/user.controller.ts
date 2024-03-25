import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    @Get('me')
    getMe(){
        return 'user info'
    }
}
