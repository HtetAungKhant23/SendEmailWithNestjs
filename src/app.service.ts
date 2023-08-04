import { HttpException, Injectable } from "@nestjs/common";
import { singupDTO } from "./app.controller";
import EmailService from "./libs/mail.service";

@Injectable()
export class AppService {
  constructor(private Email: EmailService) {}

  userData: singupDTO[] = [{ email: "admin", password: "good" }];

  getHello(): string {
    return "Hello World!";
  }

  async signup(data: singupDTO) {
    try {
      this.userData.push({ ...data });
      console.log("good", process.env.SENDER_EMAIL);

      const lau = await this.Email.sendMail({
        from: process.env.SENDER_EMAIL,
        to: data.email,
        subject: "Register successfully!",
        text: "Harararar",
        html: "Body of the email",
      });

      console.log(lau, "ok na sar lar");
      return {
        message: "successfully sign up",
        body: data,
      };
    } catch (err) {
      return new HttpException(
        {
          message: "cannot sing up",
          devMessage: "cannot-signup",
        },
        404,
      );
    }
  }
}
