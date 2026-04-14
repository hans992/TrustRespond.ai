import { describe, expect, it } from "vitest";
import ExcelJS from "exceljs";
import { injectAnswersIntoXlsxBuffer, parseQuestionnaireRows, parseQuestionnaireXlsxBuffer, splitTextIntoChunks } from "../src/index";

describe("parsers", () => {
  it("splits documents into chunks", () => {
    const chunks = splitTextIntoChunks("Policy A ".repeat(500), { chunkSize: 300, overlap: 50 });
    expect(chunks.length).toBeGreaterThan(1);
  });

  it("maps questionnaire rows to answer cells", () => {
    const rows = parseQuestionnaireRows("Q1\nQ2\nQ3");
    expect(rows[0].answerCell).toBe("B1");
    expect(rows[2].answerCell).toBe("B3");
  });

  it("parses and injects answers while preserving style", async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Security Questionnaire");
    ws.getCell("A1").value = "Question";
    ws.getCell("B1").value = "Vendor Response";
    ws.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0A1628" }
    };
    ws.getCell("B1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0A1628" }
    };
    ws.getCell("A2").value = "Do you encrypt data at rest?";
    ws.getCell("B2").value = "";
    ws.getCell("C2").value = { formula: "1+1" };

    const input = Buffer.from(await wb.xlsx.writeBuffer());
    const parsed = await parseQuestionnaireXlsxBuffer(input);
    expect(parsed.questions).toHaveLength(1);
    expect(parsed.questions[0]?.answerCell).toBe("B2");

    const injected = await injectAnswersIntoXlsxBuffer(input, [
      {
        sheetName: parsed.sheetName,
        answerCell: parsed.questions[0]!.answerCell,
        answerText: "Yes, AES-256 encryption is enabled for all persisted customer data."
      }
    ]);

    const check = new ExcelJS.Workbook();
    await check.xlsx.load(injected);
    const outSheet = check.getWorksheet("Security Questionnaire")!;
    expect(outSheet.getCell("B2").value).toBe("Yes, AES-256 encryption is enabled for all persisted customer data.");
    expect((outSheet.getCell("A1").fill as { fgColor?: { argb?: string } }).fgColor?.argb).toBe("FF0A1628");
    expect((outSheet.getCell("C2").value as { formula?: string }).formula).toBe("1+1");
  });
});
