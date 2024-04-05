import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@modules/user/entity/user.entity';
import { AuthDto } from '@modules/auth/dto/auth.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';



@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(private configService: ConfigService,
        private jwt: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectQueue('email-queue') 
        private readonly emailQueue: Queue,
        
    ) { }
    async signUp(dto: AuthDto) {
        const user = await this.userRepository.findOneBy(
            { email: dto.email }
        );
        if (!user) {
            const result = await this.emailQueue.add('register',{
                to: dto.email,
                subject: 'welcome my website',
                text: '<h1>Hello</h1>',
              }, {removeOnComplete: true});
            const hashPassword = await argon.hash(dto.password);
            const newUser = new User({ email: dto.email, password: hashPassword });
            await this.userRepository.save(newUser);

            //delete newUser.password;
            return this.signToken(newUser.id, newUser.email);;
        }
        else {
            throw new ForbiddenException('Email was used');
        }

    }

    async signIn(dto: AuthDto) {

        const user = await this.userRepository.findOneBy(
            { email: dto.email },
        );
        if (!user) {
            throw new ForbiddenException(
                'User not found',
            );
        }
        const pw = await argon.verify(user.password, dto.password);
        if (!pw) {
            throw new ForbiddenException(
                'Wrong password',
            );
        }

        //delete user.password;
        return this.signToken(user.id, user.email);
        //return user;
    }

    async signToken(userId: number, email: string) {
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

    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        try {
          this.logger.log(`Sending email to ${to} with subject: ${subject}`);
          const result = await this.emailQueue.add('register',{
            to,
            subject,
            text: body,
          }, {removeOnComplete: true});
          
          if (!result) {
            this.logger.error('Failed to add email job to queue');
            throw new Error('Failed to add email job to queue');
          }
          else{
            this.logger.error('Email was sent successfully');
          }
        } catch (error) {
          this.logger.error(`Failed to send email: ${error.message}`);
          throw error;
        }
    }
    // async sendEmail(to: string, subject: string, body: string): Promise<void> {
    //     try {
    //         this.logger.log(`Sending email to ${to} with subject: ${subject}`);
    //         await this.mailService.sendMail({
    //             to, subject, html: body, 
    //         });
    //         this.logger.log(`Email was send`);
    //     } catch (error) {
    //         this.logger.error(`Failed to send email: ${error.message}`);
    //         throw error;
    //     }
    // }
}
