import nodemailer from 'nodemailer';

function asBool(value) {
  return String(value).toLowerCase() === 'true';
}

export async function sendReviewEmail({ data, pdfBuffer, recipients, submissionId }) {
  const mode = (process.env.EMAIL_MODE || 'console').toLowerCase();
  const filename = buildFilename(data, submissionId);

  if (mode === 'console') {
    console.log('[EMAIL_MODE=console] Email suppressed.');
    console.log('Submission:', submissionId);
    console.log('Would send to:', recipients.length ? recipients.join(', ') : '(no recipients configured)');
    console.log('Attachment:', filename, `(${pdfBuffer.length} bytes)`);
    return { mode, accepted: recipients };
  }

  if (mode !== 'smtp') {
    throw new Error(`Unsupported EMAIL_MODE: ${mode}`);
  }

  if (!recipients.length) {
    throw new Error('No email recipients were determined for this submission.');
  }

  const transporter = nodemailer.createTransport({
    host: requireEnv('SMTP_HOST'),
    port: Number(process.env.SMTP_PORT || 587),
    secure: asBool(process.env.SMTP_SECURE),
    auth: {
      user: requireEnv('SMTP_USER'),
      pass: requireEnv('SMTP_PASSWORD')
    }
  });

  const info = await transporter.sendMail({
    from: requireEnv('SMTP_FROM'),
    to: recipients,
    subject: `Priority One Driving Review - ${data.employeeName} - ${data.eventDate}`,
    text: [
      'A Priority One Driving Review has been submitted.',
      '',
      `Employee: ${data.employeeName}`,
      `PID: ${data.employeePid}`,
      `Unit: ${data.unit}`,
      `Event Date: ${data.eventDate}`,
      `Incident #: ${data.incident}`,
      `Confirmation: ${submissionId}`
    ].join('\n'),
    attachments: [
      {
        filename,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  });

  return { mode, messageId: info.messageId, accepted: info.accepted };
}

function buildFilename(data, submissionId) {
  const employee = safePart(data.employeeName || 'employee');
  const date = safePart(data.eventDate || 'date');
  return `Priority-One-Driving-Review_${employee}_${date}_${submissionId}.pdf`;
}

function safePart(value) {
  return String(value)
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unknown';
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
