import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AppService } from "./app.service";
import { extname } from "path";
import { FileInterceptor } from "@nestjs/platform-express";
import multer, { diskStorage } from "multer";
import { FileSizeValidationPipe } from "./libs/fileInterceptor";

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

  @Post("/create")
  @UseInterceptors(
    FileInterceptor("excel", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join("");
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(@UploadedFile(new FileSizeValidationPipe()) file: Express.Multer.File) {
    return this.appService.create(file);
  }
}
