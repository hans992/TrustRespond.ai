import { PDFParse } from "pdf-parse";
import ExcelJS from "exceljs";

export interface ParsedChunk {
  content: string;
  metadata: { chunkIndex: number; startOffset: number; endOffset: number };
}

export interface ChunkingOptions {
  chunkSize?: number;
  overlap?: number;
}

export interface ParsedQuestionCell {
  sheetName: string;
  rowNumber: number;
  questionColumn: number;
  answerColumn: number;
  questionCell: string;
  answerCell: string;
  questionText: string;
}

export interface ParsedQuestionnaireSheet {
  sheetName: string;
  headerRow: number;
  questionColumn: number;
  questionColumnLetter: string;
  questionHeader: string;
  answerColumn: number;
  answerColumnLetter: string;
  answerHeader: string;
  questions: ParsedQuestionCell[];
}

export interface InjectedAnswer {
  sheetName: string;
  answerCell: string;
  answerText: string;
}

const DEFAULT_CHUNK_SIZE = 1200;
const DEFAULT_CHUNK_OVERLAP = 200;

export async function extractTextFromPdfBuffer(input: Buffer | Uint8Array) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  const parser = new PDFParse({ data: buffer });
  const parsed = await parser.getText();
  await parser.destroy();
  return (parsed.text ?? "").replace(/\u0000/g, "").trim();
}

function normalizeText(text: string) {
  return text.replace(/\r/g, "").replace(/\t/g, " ").replace(/[ ]{2,}/g, " ").trim();
}

export function splitTextIntoChunks(text: string, options: ChunkingOptions = {}) {
  const normalized = normalizeText(text);
  if (!normalized) {
    return [] as ParsedChunk[];
  }

  const chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const overlap = options.overlap ?? DEFAULT_CHUNK_OVERLAP;
  const stride = Math.max(1, chunkSize - overlap);

  const chunks: ParsedChunk[] = [];
  let start = 0;
  let index = 0;
  while (start < normalized.length) {
    const end = Math.min(normalized.length, start + chunkSize);
    const slice = normalized.slice(start, end).trim();
    if (slice.length > 0) {
      chunks.push({
        content: slice,
        metadata: {
          chunkIndex: index + 1,
          startOffset: start,
          endOffset: end
        }
      });
      index += 1;
    }
    if (end >= normalized.length) break;
    start += stride;
  }

  return chunks;
}

export async function parsePdfToChunks(input: Buffer | Uint8Array, options?: ChunkingOptions) {
  const extracted = await extractTextFromPdfBuffer(input);
  const chunks = splitTextIntoChunks(extracted, options);
  return { extractedText: extracted, chunks };
}

const QUESTION_HEADERS = ["question", "requirement", "control", "description", "item", "query"];
const ANSWER_HEADERS = ["answer", "response", "vendor", "comment", "reply"];

function normalizeCellText(value: ExcelJS.CellValue | null | undefined) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && "text" in value && typeof value.text === "string") return value.text.trim();
  if (typeof value === "object" && "richText" in value && Array.isArray(value.richText)) {
    return value.richText.map((part) => part.text).join("").trim();
  }
  return "";
}

function scoreHeader(text: string, tokens: string[]) {
  const lower = text.toLowerCase();
  return tokens.reduce((score, token) => (lower.includes(token) ? score + 1 : score), 0);
}

function detectHeaderRow(worksheet: ExcelJS.Worksheet) {
  let best = { rowNumber: 1, questionScore: 0, answerScore: 0 };
  for (let rowNumber = 1; rowNumber <= Math.min(25, worksheet.rowCount || 25); rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    let q = 0;
    let a = 0;
    row.eachCell({ includeEmpty: false }, (cell) => {
      const text = normalizeCellText(cell.value);
      q += scoreHeader(text, QUESTION_HEADERS);
      a += scoreHeader(text, ANSWER_HEADERS);
    });
    if (q + a > best.questionScore + best.answerScore) {
      best = { rowNumber, questionScore: q, answerScore: a };
    }
  }
  return best.rowNumber;
}

function detectColumns(worksheet: ExcelJS.Worksheet, headerRowNumber: number) {
  const row = worksheet.getRow(headerRowNumber);
  let questionColumn = 0;
  let answerColumn = 0;
  let questionScore = -1;
  let answerScore = -1;

  row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    const text = normalizeCellText(cell.value);
    const qScore = scoreHeader(text, QUESTION_HEADERS);
    const aScore = scoreHeader(text, ANSWER_HEADERS);
    if (qScore > questionScore) {
      questionScore = qScore;
      questionColumn = colNumber;
    }
    if (aScore > answerScore) {
      answerScore = aScore;
      answerColumn = colNumber;
    }
  });

  if (!questionColumn) {
    questionColumn = 2;
  }
  if (!answerColumn) {
    answerColumn = questionColumn + 1;
  }
  const questionHeader = normalizeCellText(worksheet.getCell(headerRowNumber, questionColumn).value) || "Question";
  const answerHeader = normalizeCellText(worksheet.getCell(headerRowNumber, answerColumn).value) || "Answer";
  return { questionColumn, answerColumn, questionHeader, answerHeader };
}

export async function parseQuestionnaireXlsxBuffer(input: Buffer | Uint8Array): Promise<ParsedQuestionnaireSheet> {
  const workbook = new ExcelJS.Workbook();
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  await workbook.xlsx.load(bytes as any);
  const worksheet = workbook.worksheets.find((ws) => ws.state === "visible") ?? workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("No worksheet found in workbook.");
  }

  const headerRow = detectHeaderRow(worksheet);
  const { questionColumn, answerColumn, questionHeader, answerHeader } = detectColumns(worksheet, headerRow);

  const questions: ParsedQuestionCell[] = [];
  for (let rowNumber = headerRow + 1; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const qCell = worksheet.getCell(rowNumber, questionColumn);
    const aCell = worksheet.getCell(rowNumber, answerColumn);
    const questionText = normalizeCellText(qCell.value);
    if (!questionText || questionText.length < 4) continue;

    questions.push({
      sheetName: worksheet.name,
      rowNumber,
      questionColumn,
      answerColumn,
      questionCell: qCell.address,
      answerCell: aCell.address,
      questionText
    });
  }

  return {
    sheetName: worksheet.name,
    headerRow,
    questionColumn,
    questionColumnLetter: worksheet.getColumn(questionColumn).letter,
    questionHeader,
    answerColumn,
    answerColumnLetter: worksheet.getColumn(answerColumn).letter,
    answerHeader,
    questions
  };
}

export async function injectAnswersIntoXlsxBuffer(
  input: Buffer | Uint8Array,
  answers: InjectedAnswer[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  await workbook.xlsx.load(bytes as any);

  for (const answer of answers) {
    const worksheet = workbook.getWorksheet(answer.sheetName);
    if (!worksheet) continue;
    const targetCell = worksheet.getCell(answer.answerCell);
    targetCell.value = answer.answerText;
  }

  const out = await workbook.xlsx.writeBuffer();
  return Buffer.from(out as ArrayBuffer);
}

export function parseQuestionnaireRows(content: string) {
  return content
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean)
    .map((questionText, index) => ({
      row: index + 1,
      questionText,
      answerCell: `B${index + 1}`
    }));
}
