import { Client, SendEmailV3_1, LibraryResponse } from "node-mailjet";
import mails from "./mails/index";
const mailjet = new Client({
  apiKey: process.env.MJ_APIKEY_PUBLIC || "your-api-key",
  apiSecret: process.env.MJ_APIKEY_PRIVATE || "your-api-secret",
});
export async function mailer(
  config: any,
  email: string,
  name: string,
  subject: string,
  title: string,
  message: string,
  type: number = 1,
  cotiza: any = null
) {
  try {
    let body = "";
    switch (type) {
      case 1:
        // body = mails.MailCotiza(title, message, config, name, cotiza);
        break;
      case 2:
        body = mails.MailDefault(title, message, config, name, cotiza);
        break;
    }

    const data: SendEmailV3_1.Body = {
      Messages: [
        {
          From: {
            Email: "envios@erdesarrollo.com.ve",
            Name: "Saas ErDesarrollo",
          },
          To: [
            {
              Email: email,
              Name: name,
            },
          ],
          Subject: subject,
          TextPart: message,
          HTMLPart: body,
          CustomID: "c41.Su-J3-41-M4",
        },
      ],
    };
    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
      .post("send", { version: "v3.1" })
      .request(data);
    const { Status } = result.body.Messages[0];
    return Status;
  } catch (e) {
    console.log("Error en el envio", e);
  }
}
