import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSubmissionEmail({
  pdfBuffer,
  filename,
  submissionId
}) {
  if (process.env.EMAIL_MODE !== 'resend') {
    console.log(
      `[${submissionId}] EMAIL_MODE is not resend; email not sent.`
    );
    return;
  }

  const recipient = process.env.TEST_RECIPIENT;

  if (!recipient) {
    throw new Error('TEST_RECIPIENT is not configured.');
  }

  const { data, error } = await resend.emails.send({
    from: process.env.MAIL_FROM,
    to: [recipient],
    subject: `Priority One Driving Review - ${submissionId}`,
    text:
      `A Priority One Driving Review has been submitted.\n\n` +
      `Submission ID: ${submissionId}`,
    attachments: [
      {
        filename,
        content: pdfBuffer.toString('base64')
      }
    ]
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  console.log(
    `[${submissionId}] Email sent successfully. Resend ID: ${data.id}`
  );

  return data;
}