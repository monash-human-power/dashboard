module.exports = (function util() {
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

  const setPropWithPath = (obj, path, value) => {
    if (typeof obj !== 'object') return null;
    if (path.length === 0) return value;
    const prop = path[0];
    const nextObj = hasProp(obj)(prop) ? obj[prop] : {};
    return { ...obj, [prop]: setPropWithPath(nextObj, path.slice(1), value) };
  };

  // /**
  //  * Shallow copy an object but without a property
  //  *
  //  * @param {object} obj Object
  //  * @param {string} prop Property of object (key)
  //  * @returns {object} Object
  //  */
  // const noProp = (obj, prop) =>
  //   Object.keys(obj)
  //     .filter((key) => key !== prop)
  //     .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});

  // /**
  //  * Deep merge two objects
  //  *
  //  * @param {object} target Target
  //  * @param {object} source Source
  //  * @returns {object} Merged object
  //  */
  // const deepMerge = (target, source) => {
  //   const keys = Object.keys(source);
  //   if (keys.length === 0) return target;
  //   const key = keys[0];
  //   const val = source[key];

  //   if (val instanceof Object && Object.keys(target).includes(key))
  //     // Need to merge object properties
  //     return deepMerge({ ...target, [key]: deepMerge(target[key])(val) })(
  //       noProp(source, key),
  //     );

  //   return deepMerge({ ...target, [key]: val })(noProp(source, key));
  // };

  return {
    hasProp,
    propsToObj,
    getPropWithPath,
    setPropWithPath,
  };
})();
