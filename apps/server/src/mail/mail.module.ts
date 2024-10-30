import { Logger, Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import * as nodemailer from "nodemailer";
import { MailService } from "./mail.service";

// Set up a hardcoded transporter for testing
const hardcodedTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_FROM,
    pass: process.env.GMAIL_APP_PASSWORD, // 16-digit app password
  },
});

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => {
        const from = process.env.MAIL_FROM;
        return {
          defaults: { from },
          transport: hardcodedTransporter,
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
