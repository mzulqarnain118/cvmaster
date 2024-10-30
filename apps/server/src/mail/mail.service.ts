import { Injectable, Logger } from "@nestjs/common";
import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(options: ISendMailOptions) {
    this.logger.log("Sending email with options:", options);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.GMAIL_APP_PASSWORD, // 16-digit app password
      },
    });
    try {
      const result = await transporter.sendMail({ ...options, from: process.env.MAIL_FROM });
      this.logger.log("Email sent successfully:", result);
      return result;
    } catch (error) {
      this.logger.error(
        "Failed to send email:",
        error,
        process.env.MAIL_FROM,
        process.env.GMAIL_APP_PASSWORD,
      );
      throw error;
    }
  }
}
