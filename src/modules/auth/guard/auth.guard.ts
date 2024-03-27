import { User } from '@entity/user.entity';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

import { DataSource } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private config: ConfigService,
                private dataSource: DataSource) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
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
            const userRepository = this.dataSource.getRepository(User);
            const user = await userRepository.findOneBy({
                email: decoded['email'],
            })
            request.user = user;
            
            return true;
        } catch {
            return false;
        }
    }
}