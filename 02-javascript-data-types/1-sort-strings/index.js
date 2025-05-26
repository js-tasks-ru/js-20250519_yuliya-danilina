/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  return [...arr].sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    
    const comparison = aLower.localeCompare(bLower, 'ru');
    
    if (comparison === 0) {
      return a.localeCompare(b, 'ru', { caseFirst: 'upper' });
    }
    
    return param === 'asc' ? comparison : -comparison;
  });
};