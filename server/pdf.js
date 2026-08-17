import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument, AcroTextFlags } from 'pdf-lib';
import { PDF_FIELD_MAP } from '../config/fields.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_PATH = path.resolve(
  __dirname,
  '../templates/priority-one-driving-review.pdf'
);

export async function createCompletedPdf(data) {
  const templateBytes = await fs.readFile(TEMPLATE_PATH);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  // Fix template field that is incorrectly marked as rich text
  const text2 = form.getTextField('Text2');
  text2.acroField.setFlagTo(AcroTextFlags.RichText, false);

  for (const [dataKey, pdfFieldName] of Object.entries(PDF_FIELD_MAP)) {
    let value = data[dataKey] ?? '';

    // Convert HTML date format (YYYY-MM-DD) to PDF format (MM/DD/YYYY)
    if (dataKey === 'eventDate' && value) {
      const [year, month, day] = value.split('-');
      value = `${month}/${day}/${year}`;
    }

    form.getTextField(pdfFieldName).setText(value);
  }

  return Buffer.from(
    await pdfDoc.save({ updateFieldAppearances: true })
  );
}