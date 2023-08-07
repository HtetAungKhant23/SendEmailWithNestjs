import { HttpException, Injectable } from "@nestjs/common";
import { singupDTO } from "./app.controller";
import EmailService from "./libs/mail.service";
import * as Excel from "exceljs";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class AppService {
  constructor(private Email: EmailService) {}

  userData: singupDTO[] = [{ email: "admin", password: "good", image: "hathat" }];

  getHello(): string {
    return "Hello World!";
  }

  async signup(data: singupDTO) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Record", {
      pageSetup: {
        paperSize: 9,
        orientation: "landscape",
      },
    });

    worksheet.columns = [
      { header: "No.", key: "no" },
      { header: "Customer Name", key: "name", width: 20 },
      { header: "Phone Number", key: "phone", width: 20 },
    ];

    const row = [
      { no: "12", name: "Htet Aung Khant", phone: "09123456" },
      { no: "14", name: "Htet", phone: "09654321" },
      { no: "16", name: "Htet Aung", phone: "09987654" },
    ];

    // const row = { no: "23", name: "Htet Aung Khant", phone: "09123456" };

    worksheet.addRows(row);

    try {
      const image = workbook.addImage({
        buffer: fs.readFileSync("https://res.cloudinary.com/dwrgwvvdk/image/upload/v1685877631/Blog_API/pwtjekmmsrfcljlfee4v.png"),
        extension: "png",
      });

      for (let index = 0; index < row.length; index++) {
        const item: any = row[index];
        worksheet.addImage(image, {
          tl: { col: 1, row: item.no },
          ext: { width: 50, height: 50 },
        });
        const rowId = worksheet.getRow(item.no + 1);
        rowId.height = 50;
      }

    } catch (err) {
      console.log(err);
    }

    workbook.xlsx
      .writeFile("uploads/tawtarngathi.xlsx")
      .then(() => {
        console.log("good work");
      })
      .catch(err => {
        console.log(err, "there is error");
      });

    try {
      this.userData.push({ ...data });
      console.log("good", process.env.SENDER_EMAIL);

      await this.Email.sendMail({
        from: process.env.SENDER_EMAIL,
        to: data.email,
        subject: "Sending Email to Taw Tar is successfully!",
        // text: "Harararar",
        // html: '<img src="cid:good@example.com"/>',
        html: '<h3>Nay Kaung Lr Ngwar</h3><img src="cid:good@example.com"/>',
        attachments: [
          {
            filename: "pwtjekmmsrfcljlfee4v.png",
            path: "https://res.cloudinary.com/dwrgwvvdk/image/upload/v1685877631/Blog_API/pwtjekmmsrfcljlfee4v.png",
            cid: "good@example.com",
          },
          {
            filename: "tawtarngathi.xlsx",
            path: path.join(__dirname, "../../email-send/uploads/tawtarngathi.xlsx"),
          },
        ],
      });

      console.log("ok na sar lar");

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
