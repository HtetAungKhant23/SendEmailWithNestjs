import { Injectable } from "@nestjs/common";
import { createTransport } from "nodemailer";
import * as Mail from "nodemailer/lib/mailer";

@Injectable()
export default class EmailService {
  private nodemailerTransport: Mail;

  constructor() {
    console.log(process.env.SENDER_EMAIL);
    this.nodemailerTransport = createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASS,
      },
    });
  }

  sendMail(options: Mail.Options) {
    console.log("la khwan", options);
    return this.nodemailerTransport.sendMail(options);
  }
}
