import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entity/user.entity';
import { AuthDto } from '@dto/auth.dto';


@Injectable()
export class AuthService {
    constructor(private configService: ConfigService,
                private jwt: JwtService,
                @InjectRepository(User)
                private userRepository: Repository<User>,
        ) {}
    async signUp(dto: AuthDto){
        const user = await this.userRepository.findOneBy(
            {email: dto.email }
        );
        if(!user){
            
            const hashPassword = await argon.hash(dto.password);
            const newUser = new User({email: dto.email, password: hashPassword});
            await this.userRepository.save(newUser);

            //delete newUser.password;
            return this.signToken(newUser.id, newUser.email);;
        }
        else{
            throw  new ForbiddenException('Email was used');
        }

    }

    async signIn(dto: AuthDto){
        
        const user = await this.userRepository.findOneBy(
            {email: dto.email},
        );
        if(!user){
            throw new ForbiddenException(
                'User not found',
            );
        }
        const pw = await argon.verify(user.password, dto.password);
        if(!pw){
            throw new ForbiddenException(
                'Wrong password',
            );
        }

        //delete user.password;
        return this.signToken(user.id, user.email);
        //return user;
    }

    async signToken(userId: number, email: string){
        const payload = {
            sub: userId,
            email: email,
        }
        const secret = this.configService.get("JWT_SECRET");
        const token = await this.jwt.signAsync(
            payload,
            {
                expiresIn: '20m',
                secret: secret,
            }
        );
        return {
            access_token: token
        };
    }
}
