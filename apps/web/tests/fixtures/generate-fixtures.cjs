const fs = require("fs/promises");
const path = require("path");
const ExcelJS = require("exceljs");
const { PDFDocument, StandardFonts } = require("pdf-lib");

const FIXTURE_NAMES = {
  pdf: "golden.pdf",
  xlsx: "golden.xlsx"
};

async function generateFixtures(outputDir) {
  await fs.mkdir(outputDir, { recursive: true });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sheet1");
  sheet.getCell(1, 1).value = "Question";
  sheet.getCell(1, 2).value = "Answer";
  sheet.getCell(2, 1).value = "Does the company encrypt data at rest?";
  sheet.getCell(2, 2).value = "";
  const xlsxPath = path.join(outputDir, FIXTURE_NAMES.xlsx);
  await workbook.xlsx.writeFile(xlsxPath);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const lines = [
    "Security control: All customer data is encrypted at rest using AES-256.",
    "Access is logged and monitored. Network traffic uses TLS 1.2 or higher.",
    "This paragraph ensures PDF text extraction yields chunks for the knowledge base ingestion pipeline."
  ];
  let y = 720;
  for (const line of lines) {
    page.drawText(line, { x: 50, y, size: 11, font });
    y -= 16;
  }
  const pdfBytes = await pdfDoc.save();
  await fs.writeFile(path.join(outputDir, FIXTURE_NAMES.pdf), pdfBytes);
}

module.exports = { generateFixtures, FIXTURE_NAMES };
