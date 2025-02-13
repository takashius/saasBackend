"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailer = mailer;
const node_mailjet_1 = require("node-mailjet");
const index_1 = __importDefault(require("./mails/index"));
const mailjet = new node_mailjet_1.Client({
    apiKey: process.env.MJ_APIKEY_PUBLIC || "your-api-key",
    apiSecret: process.env.MJ_APIKEY_PRIVATE || "your-api-secret",
});
async function mailer(config, email, name, subject, title, message, type = 1, cotiza = null) {
    try {
        let body = "";
        switch (type) {
            case 1:
                // body = mails.MailCotiza(title, message, config, name, cotiza);
                break;
            case 2:
                body = index_1.default.MailDefault(title, message, config, name, cotiza);
                break;
        }
        const data = {
            Messages: [
                {
                    From: {
                        Email: "envios@erdesarrollo.com.ve",
                        Name: "AdminSchool",
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
        const result = await mailjet
            .post("send", { version: "v3.1" })
            .request(data);
        const { Status } = result.body.Messages[0];
        return Status;
    }
    catch (e) {
        console.log("Error en el envio", e);
    }
}
