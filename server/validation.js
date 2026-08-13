import { FORM_FIELDS } from '../config/fields.js';

export function validateSubmission(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ValidationError('Invalid submission payload.');
  }

  const data = {};

  for (const field of FORM_FIELDS) {
    const value = body[field];
    data[field] = value == null ? '' : String(value).trim();
  }

  // Conservative first-pass requirements. These are deliberately easy to
  // change when the final field rules are defined.
  const required = [
    'employeeName',
    'employeePid',
    'unit',
    'eventDate',
    'eventTime',
    'incident',
    'eventType',
    'eventAddress'
  ];

  const missing = required.filter((field) => !data[field]);
  if (missing.length) {
    throw new ValidationError(`Missing required field(s): ${missing.join(', ')}`);
  }

  return data;
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}
