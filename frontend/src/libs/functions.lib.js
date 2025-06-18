/**
 * Formats a date string to a value compatible with an <input type="datetime-local">.
 * Adjusts for local timezone and returns a string in 'YYYY-MM-DDTHH:mm' format.
 * @param {string} dateString - ISO date string or date value
 * @returns {string} Formatted local datetime string or empty string if input is falsy
 */
export function formatToDatetimeLocal(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}

/**
 * Converts a datetime-local string (from an input) to an ISO string, if provided.
 * Returns undefined if input is empty or falsy.
 * @param {string} datetimeLocal - Local datetime string in 'YYYY-MM-DDTHH:mm' format
 * @returns {string|undefined} ISO string or undefined
 */
export function toISOStringIfFilled(datetimeLocal) {
  if (!datetimeLocal) return undefined;
  const date = new Date(datetimeLocal);
  return date.toISOString();
}