import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import SMTPPool from 'nodemailer/lib/smtp-pool';

@Injectable()
export class NotificationsService {
  private readonly transporter: nodemailer.Transporter<
    SMTPPool.SentMessageInfo,
    SMTPPool.Options
  >;

  constructor(private readonly configService: ConfigService) {
    const nodeMailerConfig = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get<string>('SMTP_USER'),
        clientId: this.configService.get<string>('GOOGLE_OAUTH_CLIENT_ID'),
        clientSecret: this.configService.get<string>(
          'GOOGLE_OAUTH_CLIENT_SECRET',
        ),
        refreshToken: this.configService.get<string>(
          'GOOGLE_OAUTH_REFRESH_TOKEN',
        ),
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.transporter = nodemailer.createTransport(nodeMailerConfig as any);
  }

  async notifyEmail({ email, text }: NotifyEmailDto) {
    console.log('Start notifying process ------');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_USER'),
      to: email,
      subject: 'Sleeper Notification',
      text,
    });
  }
}
