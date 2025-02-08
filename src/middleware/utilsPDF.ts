import axios from "axios";
import { numFormat } from "./utils";

export async function generateHeader(doc: any, data: any, config: any) {
  const logo = data.logo ? await fetchImage(data.logo) : null;
  const logoAlpha = data.logoAlpha ? await fetchImage(data.logoAlpha) : null;
  if (logo)
    doc.image(logo, config.logo.x, config.logo.y, { width: config.logo.width });
  if (logoAlpha)
    doc.image(logoAlpha, config.logoAlpha.x, config.logoAlpha.y, {
      width: config.logoAlpha.width,
    });

  doc
    .fontSize(12)
    .font("Times-Bold")
    .text(data.name, 30, 70)
    .fontSize(8)
    .font("Times-Roman")
    .text(data.address, 30, 85)
    .fontSize(10)
    .text(`RIF ${data.rif}`, 470, 60, {
      width: 80,
      align: "right",
    })
    .font("Times-Bold")
    .fontSize(8)
    .text(data.phone, 30, 100)
    .moveDown();
}

export function renderShapes(doc: any, libre: boolean) {
  doc.lineWidth(0.5);

  if (!libre) doc.lineJoin("round").roundedRect(350, 50, 215, 60, 10).stroke(); // RECTANGLE INVOICE NUMBER
  doc.lineJoin("round").roundedRect(30, 150, 380, 70, 10).stroke(); // RECTANGLE INFO CUSTOMER
  doc.lineJoin("round").roundedRect(420, 150, 140, 70, 10).stroke(); // RECTANGLE CUSTOMER CODE
  doc.lineJoin("round").roundedRect(30, 230, 530, 450, 10).stroke(); // RECTANGLE FOR INVOICE ITEMS

  doc.moveTo(30, 167).lineTo(410, 167).stroke(); //LINE FROM NAME COMPANY
  doc.moveTo(165, 167).lineTo(165, 184).stroke(); //VERTICAL LINE PLACE
  doc.moveTo(30, 184).lineTo(410, 184).stroke(); //LINE FROM RIF | PLACE
  doc.moveTo(30, 202).lineTo(410, 202).stroke(); //LINE FROM ADDRESS
  doc.moveTo(225, 202).lineTo(225, 220).stroke(); //VERTICAL LINE PHONE
  doc.moveTo(420, 184).lineTo(560, 184).stroke(); //LINE FROM CUSTOMER CODE
  doc.moveTo(30, 250).lineTo(560, 250).stroke(); //LINE FROM TITLES INVOICE ITEMS
  //LINES VERTICALY FROM SEPARATOR INVOICE ITEMS
  doc.moveTo(100, 230).lineTo(100, 680).stroke(); //LINE FROM AMOUNT
  doc.moveTo(400, 230).lineTo(400, 680).stroke(); //LINE FROM DESCRIPTION
  doc.moveTo(480, 230).lineTo(480, 680).stroke(); //LINE FROM UNIT PRICE
  //LINES FROM TOTALS
  doc.moveTo(480, 680).lineTo(480, 730).stroke(); //750 CON TASA CALCULADA
  doc.moveTo(560, 670).lineTo(560, 730).stroke();
  doc.moveTo(340, 700).lineTo(560, 700).stroke();
  doc.moveTo(340, 715).lineTo(560, 715).stroke();
  doc.moveTo(340, 700).lineTo(340, 715).stroke();
  doc.moveTo(480, 730).lineTo(560, 730).stroke();
  // doc.moveTo(480, 750).lineTo(560, 750).stroke();
  //LINE FOR RECEIVED
  doc.moveTo(90, 715).lineTo(230, 715).stroke();
}

export function renderItems(
  doc: any,
  data: any,
  currency: string,
  rate: number
) {
  doc.font("Times-Roman").fontSize(9);
  let y = 255;
  let subtotal = 0;
  let base = 0;

  data.map((item) => {
    let price = item.price;
    if (currency === "Bs") {
      price = item.price * rate;
    }
    const itemTotal = price * item.amount;
    subtotal += itemTotal;
    if (item.iva) {
      base += itemTotal;
    }
    doc
      .text(item.amount, 30, y, { width: 70, align: "center" })
      .text(item.name, 105, y)
      .text(numFormat(price), 405, y, { width: 70, align: "right" })
      .text(numFormat(itemTotal), 485, y, {
        width: 70,
        align: "right",
      });
    y += 10;
  });

  return { subtotal, base };
}

export function renderDataInvoice(
  doc: any,
  customer: any,
  date: string,
  number: number,
  currency: string,
  libre: boolean
) {
  const address = customer.addresses[0];
  doc.font("Times-Roman");
  if (!libre) {
    if (number !== 0) {
      doc
        .fontSize(10)
        .text(`FACTURA ${String(number).padStart(8, "0")}`, 360, 80)
        .text(`No. DE CONTROL 00-${String(number).padStart(8, "0")}`, 360, 95);
    } else {
      doc.fontSize(10).text(`PRESUPUESTO`, 360, 80).text(``, 360, 95);
    }
  }
  doc
    .fontSize(9)
    .text(
      `Nombre o Razón Social: ${customer.name} ${customer.lastname}`,
      40,
      157
    )
    .text(`RIF: ${customer.rif}`, 40, 174)
    .text(`Lugar y Fecha de Emisión: ${date}`, 170, 174)
    .text(`Dirección Fiscal: ${address.line1 ? address.line1 : ""}`, 40, 189)
    .text(`${address.line2 ? address.line2 : ""}`, 40, 208)
    .text(`Teléfono: ${customer.phone ? customer.phone : ""}`, 230, 208)
    .text("Código de Cliente: 1", 430, 167)
    .text("Forma de Pago: Contado", 430, 202)
    .font("Times-Bold")
    .fontSize(7)
    .text("CANTIDAD", 45, 238)
    .text(`CONCEPTO O DESCRIPCIÓN`, 190, 238)
    .text(`PRECIO UNITARIO ${currency}`, 405, 238)
    .text(`TOTAL ${currency}`, 510, 238);
}

export function renderDataTotal(
  doc: any,
  data: any,
  number: number,
  currency: string,
  libre: boolean
) {
  const totalIva = (data.iva / 100) * data.baseImponible;
  const total = totalIva + data.subtotal;
  const totalBs = total * data.tasa;
  doc
    .font("Times-Roman")
    .fontSize(9)
    .text(`RECIBIDO POR`, 130, 720)
    .text(`SUB-TOTAL`, 420, 688)
    .text(numFormat(data.subtotal, currency), 485, 688, {
      width: 70,
      align: "right",
    })
    .text(
      `I.V.A. ${data.iva}% SOBRE ${numFormat(data.baseImponible, currency)}`,
      325,
      705,
      { width: 150, align: "right" }
    )
    .text(numFormat(totalIva, currency), 485, 705, {
      width: 70,
      align: "right",
    })
    .font("Times-Bold")
    .text(`TOTAL A PAGAR`, 395, 720)
    .text(numFormat(total, currency), 485, 720, { width: 70, align: "right" });
  // .text(`TOTAL Bs SEGUN TASA ${numFormat(data.tasa, currency)}`, 305, 735, {
  //   width: 170,
  //   align: "right",
  // })
  // .text(numFormat(totalBs, currency), 485, 735, { width: 70, align: "right" });

  if (number !== 0 && !libre) {
    doc
      .font("Times-Roman")
      .text(`RECIBIDO POR`, 130, 720)
      .text(`ESTA FACTURA VA SIN TACHADURA NI ENMIENDAS`, 30, 760)
      .font("Times-Bold")
      .text(`ORIGINAL`, 30, 775);
  }
}

const fetchImage = async (src: string) => {
  const image = await axios.get(src, {
    responseType: "arraybuffer",
  });
  return image.data;
};
