import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { PDFParse } from "pdf-parse";

const require = createRequire(import.meta.url);

try {
  const pkgJson = require.resolve("pdfjs-dist/package.json");
  const workerFsPath = path.join(path.dirname(pkgJson), "legacy", "build", "pdf.worker.mjs");
  PDFParse.setWorker(pathToFileURL(workerFsPath).href);
} catch {
  // If resolution fails, pdf-parse falls back to default worker resolution.
}
