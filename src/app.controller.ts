import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";

export interface singupDTO {
  email: string;
  password: string;
  image: string;
}

@Controller("signup")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  singup(@Body() data: singupDTO) {
    console.log("hay");
    return this.appService.signup(data);
  }
}
