/**
 * Gets the function name of the specified function
 *
 * @function
 *
 * @param func
 *
 * @returns {string}
 */
export function getFunctionName(func) {

    // get the name of the function
    let name = func.toString().substring('function '.length);
    name = name.substring(0, name.indexOf('('));

    // if the string is not empty
    return (name && name.trim()) ? name : 'anonymous';

}
