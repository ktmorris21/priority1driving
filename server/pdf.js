import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument } from 'pdf-lib';
import { PDF_FIELD_MAP } from '../config/fields.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_PATH = path.resolve(__dirname, '../templates/priority-one-driving-review.pdf');

export async function createCompletedPdf(data) {
  const templateBytes = await fs.readFile(TEMPLATE_PATH);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  for (const [dataKey, pdfFieldName] of Object.entries(PDF_FIELD_MAP)) {
    form.getTextField(pdfFieldName).setText(data[dataKey] ?? '');
  }

  return Buffer.from(
    await pdfDoc.save()
  );
}
