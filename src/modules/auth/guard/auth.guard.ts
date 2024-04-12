import { User } from '@modules/user/entity/user.entity';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

import { DataSource, Repository } from 'typeorm';
import { IS_PUBLIC_KEY } from '@modules/auth/decorator/public.decorator';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private config: ConfigService,
                private reflector: Reflector,
                @InjectRepository(User)
                private userRepository: Repository<User>,) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return false;
        }

        const [bearer, token] = authHeader.split(' ');

        if (bearer !== 'Bearer' || !token) {
            return false;
        }
        try {
            const decoded = jwt.verify(token, this.config.get('JWT_SECRET'));

            const user = await this.userRepository.findOneBy({
                email: decoded['email'],
            })
            request.user = user;
            
            return true;
        } catch {
            return false;
        }
    }
}