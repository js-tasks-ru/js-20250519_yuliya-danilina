/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return undefined;
    }

    const inverted = {};
    for (let [key, value] of Object.entries(obj)) {
        if (typeof value === 'function' || (typeof value === 'object' && value !== null)) {
            continue;
        }
        inverted[value] = key;
    }
    return inverted;
}
