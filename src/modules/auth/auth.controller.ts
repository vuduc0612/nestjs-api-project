import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@modules/auth/auth.service';
import { AuthDto } from '@modules/auth/dto/auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}
    @Post('signup')
    singup(@Body() dto: AuthDto){
        return this.authService.signUp(dto);
    }

    @Post('signin')
    singin(@Body() dto: AuthDto){
        return this.authService.signIn(dto);
    }
    
}
