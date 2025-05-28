/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (size === undefined) {
        return string;
    }

    if (typeof string !== 'string' || typeof size !== 'number' || size <= 0) return '';
  
    let result = '';
    let count = 0;
  
    for (let i = 0; i < string.length; i++) {
        count = (string[i] === string[i-1]) ? count + 1 : 1;
        if (count <= size) result += string[i];
    }
  
    return result;
}

console.log(trimSymbols('xxxaaaaab', 3));
