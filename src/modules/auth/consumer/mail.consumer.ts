
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';


@Processor('email-queue')
export class EmailConsumer {
  private readonly logger = new Logger(EmailConsumer.name);
  constructor(private  mailService: MailerService) {}

  @Process('register')
  async sendEmail(job: Job<{to: string, subject: string, body: string}>) {
    
    this.logger.log(`Using queue`);
    console.log(job.data);
    await this.mailService.sendMail({
      to: job.data.to, 
      subject: job.data.subject, 
      html: job.data.body
    });
    this.logger.log(`Email was sent`);
  }
}