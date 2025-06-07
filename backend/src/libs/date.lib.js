import { DateTime } from 'luxon';

export function toHermosillo(dt) {
    if (!dt) return null;
    return DateTime.fromJSDate(dt, { zone: 'utc' }).setZone('America/Hermosillo').toFormat('yyyy-MM-dd HH:mm:ss');
}