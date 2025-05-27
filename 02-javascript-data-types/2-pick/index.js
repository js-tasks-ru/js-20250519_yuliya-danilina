/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    const entries = new Map(Object.entries(obj));
    const resultObj = {};
    
    fields.forEach((field) => {
        if (entries.has(field)) {
            resultObj[field] = entries.get(field);
        }
    })

    return resultObj;

};
