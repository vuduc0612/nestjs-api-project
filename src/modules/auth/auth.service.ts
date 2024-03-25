import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { DataSource } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private dataSource: DataSource,
                private configService: ConfigService,
                private jwt: JwtService,
        ) {}
    async signUp(dto: AuthDto){
        const userRepository = this.dataSource.getRepository(User);
        const user = await userRepository.findOneBy(
            {email: dto.email }
        );
        if(!user){
            const hashPassword = await argon.hash(dto.password);
            const newUser = new User({email: dto.email, password: hashPassword});
            await userRepository.save(newUser);

            delete newUser.password;
            return this.signToken(newUser.id, newUser.email);;
        }
        else{
            throw  new ForbiddenException('Email was used');
        }

    }

    async signIn(dto: AuthDto){
        const userRepository = this.dataSource.getRepository(User);
        const user = await userRepository.findOneBy(
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
