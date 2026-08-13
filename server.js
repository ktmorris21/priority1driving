import 'dotenv/config';
import crypto from 'node:crypto';
import express from 'express';

import {
  validateSubmission,
  ValidationError
} from './server/validation.js';

import { createCompletedPdf } from './server/pdf.js';
import { sendSubmissionEmail } from './server/email.js';

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '100kb' }));
app.use(express.static('public'));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/submit', async (req, res) => {
  const submissionId = crypto.randomBytes(4).toString('hex').toUpperCase();

  try {
    const data = validateSubmission(req.body);

    const pdfBuffer = await createCompletedPdf(data);

    await sendSubmissionEmail({
      pdfBuffer,
      filename: `Priority-One-Driving-Review-${submissionId}.pdf`,
      submissionId
    });

    console.log(`[${submissionId}] Submission completed.`);

    res.json({
      ok: true,
      submissionId
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        ok: false,
        error: error.message
      });
    }

    console.error(`[${submissionId}] Submission failed:`, error);

    res.status(500).json({
      ok: false,
      error:
        'The review could not be submitted. Please try again or contact the administrator.',
      submissionId
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Priority One Driving Review listening on port ${port}`);
  console.log(`Email mode: ${process.env.EMAIL_MODE || 'console'}`);
});