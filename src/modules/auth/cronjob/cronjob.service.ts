
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);
    constructor(private mailService: MailerService) { }
    @Cron(CronExpression.EVERY_2ND_HOUR_FROM_1AM_THROUGH_11PM)
    async handleCron() {
        await this.mailService.sendMail({
            to: 'duc@gmail.com',
            subject: 'Code please',

        })
        this.logger.debug('Email was sent');
        
    }
}