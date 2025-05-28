/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const keys = path.split('.');

    function getValue(obj, [currentKey, ...remainingKeys]) {
        if (!obj || !Object.prototype.hasOwnProperty.call(obj, currentKey)) {
            return undefined;
        }
        return remainingKeys.length === 0 
            ? obj[currentKey] 
            : getValue(obj[currentKey], remainingKeys);
    }

    return (obj) => getValue(obj, keys);
}
