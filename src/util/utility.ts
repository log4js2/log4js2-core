/**
 * log4js2 <https://github.com/anigenero/log4js2>
 *
 * Copyright 2016-present Robin Schultz <http://anigenero.com>
 * Released under the MIT License
 */
export class Utility {

    /**
     * Gets the function name of the specified function
     *
     * @function
     * @param {Function} func
     *
     * @returns {string}
     */
    static getFunctionName(func: Function): string {

        // get the name of the function
        let name = func.toString().substring('function '.length);
        name = name.substring(0, name.indexOf('('));

        // if the string is not empty
        return (name && name.trim()) ? name : 'anonymous';

    }

}
