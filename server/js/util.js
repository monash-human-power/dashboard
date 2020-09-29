/**
 * Check if an object has a property
 *
 * @param {object} obj Object
 * @return {(prop:string) => boolean} Curried function
 */
const hasProp = (obj) => (prop) =>
  Object.prototype.hasOwnProperty.call(obj, prop);

/**
 * Create a nested object from a path of properties
 *
 * @param {string[]} path Path
 * @param {any} value Value at the end of path
 */
const propsToObj = (path, value = {}) =>
  path.length ? { [path[0]]: propsToObj(path.slice(1), value) } : value;

/**
 * Get a (nested) property of an object
 *
 * @param {object} obj Object
 * @param {string[]} path Path to desired property
 */
const getPropWithPath = (obj, path) => {
  if (obj === null) return null;
  if (path.length === 0) return obj;
  const prop = path[0];
  const nextObj = hasProp(obj)(prop) ? obj[prop] : null;
  return getPropWithPath(nextObj, path.slice(1));
};

/**
 * Set a (nested) property of an object using a path of properties
 *
 * @param {object} obj Object
 * @param {string[]} path Path of properties
 * @param {any} value Value at the end of path
 */
const setPropWithPath = (obj, path, value) => {
  if (typeof obj !== 'object') return null;
  if (path.length === 0) return value;
  const prop = path[0];
  const nextObj = hasProp(obj)(prop) ? obj[prop] : {};
  return { ...obj, [prop]: setPropWithPath(nextObj, path.slice(1), value) };
};

module.exports = {
  hasProp,
  propsToObj,
  getPropWithPath,
  setPropWithPath,
};
