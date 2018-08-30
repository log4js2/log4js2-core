/**
 * Gets the function name of the specified function
 *
 * @function
 * @param {Function} func
 *
 * @returns {string}
 */
export const getFunctionName = (func: () => any): string => {

    if (func.name !== '') {
        return func.name;
    } else {

        // get the name of the function
        let name = func.toString().substring('function '.length);
        name = name.substring(0, name.indexOf('('));

        // if the string is not empty
        return (name && name.trim()) ? name : 'anonymous';

    }

};

/**
 * Determines whether or not the value is an array. Return false is null
 *
 * @param {any} value
 * @returns {boolean} true if non-null array, else false
 */
export const isArray = <T>(value: T) => {
    return (typeof value === 'object' && value instanceof Array);
};
