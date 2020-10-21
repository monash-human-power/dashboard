/**
 * Capitalise a string
 *
 * @param {string} string String to capitalise
 * @returns {string} Capitalised string
 */
export function capitalise(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Convert a camel cased string ('fooBar') to start case ('Foo Bar')
 *
 * @param {string} string String to convert
 * @returns {string} Start case string
 */
export function camelCaseToStartCase(string) {
  const split = string.replace(/([A-Z])/g, ' $1');
  return capitalise(split);
}

/**
 * Converts number of bytes to a more human readable unit.
 *
 * By StackOverflow's community https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
 *
 * @param {number} bytes -- Number of bytes
 * @param {number} digits -- Number of decimal places to round to
 * @returns {string} bytes represented in a format with units
 */
export function formatBytes(bytes, digits = 2) {
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

/**
 * Converts a number of minutes to the format mm:ss.
 * 
 * @param {number} totalMinutes number of minuets to format
 * @returns {string} The formatted duration.
 */
export function formatMinutes(totalMinutes) {
  const mins = Math.floor(totalMinutes);
  const secs = Math.floor((totalMinutes - mins) * 60);
  return `${mins}m ${secs}s`;
}