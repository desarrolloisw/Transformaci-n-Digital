/**
 * Date utility functions
 *
 * Provides functions for formatting dates to the Hermosillo timezone and formatting date fields in data objects.
 *
 * Exports:
 *   - toHermosillo: Converts a JS Date to 'America/Hermosillo' timezone and formats as 'yyyy-MM-dd HH:mm:ss'
 *   - formatDates: Formats createdAt and updatedAt fields of a data object to Hermosillo timezone
 */

import { DateTime } from 'luxon';

/**
 * Convert a JavaScript Date to the 'America/Hermosillo' timezone and format as 'yyyy-MM-dd HH:mm:ss'.
 * @param {Date} dt - The date to convert.
 * @returns {string|null} The formatted date string or null if input is falsy.
 */
export function toHermosillo(dt) {
    if (!dt) return null;
    return DateTime.fromJSDate(dt, { zone: 'utc' }).setZone('America/Hermosillo').toFormat('yyyy-MM-dd HH:mm:ss');
}

/**
 * Format the createdAt and updatedAt fields of a data object to Hermosillo timezone.
 * @param {Object} data - The data object containing createdAt and updatedAt fields.
 * @returns {Object} The data object with formatted date fields.
 */
export function formatDates(data) {
  return {
    ...data,
    createdAt: toHermosillo(data.createdAt),
    updatedAt: toHermosillo(data.updatedAt),
  };
}