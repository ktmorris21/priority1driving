function parseRecipients(value = '') {
  return value
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);
}

/**
 * Central home for recipient-routing rules.
 *
 * For now this returns DEFAULT_RECIPIENTS from the environment so the app can
 * be scaffolded and tested before the real business rules are defined.
 * Replace/add rules here once we know which inputs determine recipients.
 */
export function determineRecipients(data) {
  void data;
  return parseRecipients(process.env.DEFAULT_RECIPIENTS);
}
