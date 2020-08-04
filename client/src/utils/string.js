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
