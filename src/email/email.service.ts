import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST')!,
      port: +this.configService.get<number>('EMAIL_PORT')!,
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER')!,
        pass: this.configService.get<string>('EMAIL_PASS')!,
      },
    });

     this.transporter.verify().then(() => {
      console.log('SMTP server is ready to send messages');
    }).catch((err) => {
      console.error('SMTP connection failed:', err);
    });
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const resetUrl = `${this.configService.get<string>('RESET_PASSWORD_URL')}${token}`;

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject: 'Reset your password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw new Error('Failed to send email');
    }
  }

  // send booking email
  async sendBookingConfirmationEmail(to: string) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject: 'Booking Confirmation',
      html: `
        <h1>Thank you for your booking!</h1>
        <p>Your appointment has been successfully booked.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      throw new Error('Failed to send email');
    }
  }
}
