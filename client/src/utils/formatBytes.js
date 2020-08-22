/**
 * Converts number of bytes to a more human readable unit.
 *
 * By StackOverflow's community https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
 *
 * @param {number} bytes -- Number of bytes
 * @param {number} digits -- Number of decimal places to round to
 * @returns {string} bytes represented in a format with units
 */
export default function formatBytes(bytes, digits = 2) {
  if (bytes === 0) return '0 Bytes';
  const units = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];
  const d = digits < 0 ? 0 : digits;
  const mag = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / 1024 ** mag).toFixed(d))} ${units[mag]}`;
}
