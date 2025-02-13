"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dolarBcv = dolarBcv;
exports.numFormat = numFormat;
exports.textBodyEmail = textBodyEmail;
const cheerio = __importStar(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const https = __importStar(require("https"));
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const formato = (str, int = 0) => {
    const coins = ["USD", "EUR", "CNY", "TRY", "RUB"];
    const valor = str
        .replace(/(\r\n|\n|\r)/gm, "")
        .replace(coins[int], "")
        .trim()
        .replace(",", ".");
    const res = parseFlt(valor);
    return res;
};
const parseFlt = (str, int = 2) => {
    const res = parseFloat(str).toFixed(int);
    return res;
};
async function dolarBcv() {
    const bcv = await axios_1.default.get("https://www.bcv.org.ve", { httpsAgent });
    const $ = cheerio.load(bcv.data);
    const dollar = formato($("#dolar").text());
    return dollar;
}
function numFormat(number, currency = "$") {
    let options = {};
    switch (currency) {
        case "$":
            options = {
                style: "currency",
                currency: "USD",
            };
            break;
        case "Bs":
            options = {
                style: "currency",
                currency: "VED",
            };
            break;
        case "€":
            options = {
                style: "currency",
                currency: "EUR",
            };
            break;
    }
    if (options.currency === "VED") {
        return new Intl.NumberFormat("de-DE", options)
            .format(number)
            .replace("VED", "Bs");
    }
    else {
        return new Intl.NumberFormat("de-DE", options).format(number);
    }
}
function textBodyEmail(text, company, cotiza) {
    text = text.replace(/</g, "&60;");
    text = text.replace(/>/g, "&62;");
    text = text.replace(/{br}/g, "<br />");
    text = text.replace(/{cotizaNumber}/g, cotiza.number);
    text = text.replace(/{CompanyName}/g, company.name);
    text = text.replace(/{emailCompany}/g, `<a href="mailto:${company.email}" style="text-decoration: none; color: ${company.configMail.colors.primary}">${company.email}</a>`);
    return text;
}
