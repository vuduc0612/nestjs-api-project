import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private config: ConfigService) { }
    canActivate(context: ExecutionContext): boolean {
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
            request.user = decoded; // Lưu thông tin người dùng được giải mã từ token
            return true;
        } catch {
            return false;
        }
    }
}