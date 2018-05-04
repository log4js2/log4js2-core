type DateFormatFunction = (date: Date, isUTC?: boolean) => string | number;

const TIMEZONE: RegExp = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
const TIMEZONE_CLIP: RegExp = /[^-+\dA-Z]/g;

/**
 * Pads numbers in the date format
 *
 * @param {string|number} value
 * @param {number} length
 * @param {string} character
 *
 * @returns {string} the padded string
 */
export const padLeft = (value: string | number, length: number, character: string = ' '): string => {

    let strValue = String(value);
    while (strValue.length < length) {
        strValue = character + strValue;
    }

    return strValue;

};

export enum DateTimeFormat {
    DEFAULT = 'yyyy-MM-dd HH:mm:ss,S',
    ABSOLUTE = 'HH:mm:ss,S',
    COMPACT = 'yyyyMMddHHmmssS',
    DATE = 'dd MMM yyyy HH:mm:ss,S',
    ISO8601 = 'yyyy-MM-ddTHH:mm:ss,S',
    ISO8601_BASIC = 'yyyyMMddTHHmmss,S'
}

const _i18n = {
    d: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday',
        'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    m: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
        'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
};

const _maskStore: { [key: string]: Array<DateFormatFunction | string> } = {};
const _flags: { [key: string]: DateFormatFunction } = {

    d: (date) => date.getDate(),
    dd: (date) => padLeft(date.getDate(), 2, '0'),
    ddd: (date) => _i18n.d[date.getDay()],
    dddd: (date) => _i18n.d[date.getDay() + 7],
    M: (date) => date.getMonth() + 1,
    MM: (date) => padLeft(date.getMonth() + 1, 2, '0'),
    MMM: (date) => _i18n.m[date.getMonth()],
    MMMM: (date) => _i18n.m[date.getMonth() + 12],
    yy: (date, isUTC) => String(isUTC ? date.getFullYear() : date.getUTCFullYear()).slice(2),
    yyyy: (date, isUTC) => isUTC ? date.getFullYear() : date.getUTCFullYear(),
    h: (date) => date.getHours() % 12 || 12,
    hh: (date) => padLeft(date.getHours() % 12 || 12, 2, '0'),
    H: (date) => date.getHours(),
    HH: (date) => padLeft(date.getHours(), 2, '0'),
    m: (date) => date.getMinutes(),
    mm: (date) => padLeft(date.getMinutes(), 2, '0'),
    s: (date) => date.getSeconds(),
    ss: (date) => padLeft(date.getSeconds(), 2, '0'),
    S: (date) => padLeft(date.getMilliseconds(), 1),
    a: (date) => date.getHours() < 12 ? 'a' : 'p',
    aa: (date) => date.getHours() < 12 ? 'am' : 'pm',
    A: (date) => date.getHours() < 12 ? 'A' : 'P',
    AA: (date) => date.getHours() < 12 ? 'AM' : 'PM',
    Z: (date, isUTC) => isUTC ? 'UTC' : (String(date).match(TIMEZONE)).pop().replace(TIMEZONE_CLIP, ''),
    o: (date, isUTC) => {
        const offset = isUTC ? 0 : date.getTimezoneOffset();
        return (offset > 0 ? '-' : '+') + padLeft(Math.floor(Math.abs(offset) / 60) * 100 + Math.abs(offset) % 60, 4, '0');
    }

};

function _createMask(mask: string) {

    if (_maskStore[mask] instanceof Array) {
        return _maskStore[mask];
    }

    const formatMap = [];
    const regex = /(.)\1+|(.)/;

    let maskStr = mask;
    let match: RegExpMatchArray;
    let value: string;

    // tslint:disable-next-line:no-conditional-assignment
    while (match = maskStr.match(regex)) {

        match = maskStr.match(regex);
        value = match[0];

        formatMap.push(_flags[value] || value);

        maskStr = maskStr.substring(value.length);

    }

    _maskStore[mask] = formatMap;

    return formatMap;

}

/**
 * Converts a date to a formatted string
 * @param {Date | string | number} date
 * @param {string} mask
 * @returns {string}
 */
export const formatDate = (date: Date | string | number, mask?: string): string => {

    if (!(date instanceof Date)) {
        date = new Date(date as any);
    }

    mask = String(mask || DateTimeFormat.DEFAULT);

    const isUTC = (mask.slice(0, 4) === 'UTC:');
    if (isUTC) {
        mask = mask.slice(4);
    }

    return _createMask(mask).map((value) => {
        return value instanceof Function ? value(date as Date, isUTC) : value;
    }).join('');

};
