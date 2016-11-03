/**
 * log4js <https://github.com/anigenero/log4js2>
 *
 * Copyright 2016-present Robin Schultz <http://anigenero.com>
 * Released under the MIT License
 */

let i18n = {
	'd' : [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday',
		'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
	'm' : [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
		'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December' ]
};

const TOKEN = /d{1,4}|M{1,4}|yy(?:yy)?|([HhmsAa])\1?|[LloSZ]|'[^']*'|'[^']*'/g;
const TIMEZONE = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
const TIMEZONE_CLIP = /[^-+\dA-Z]/g;

/**
 * Predefined DATE formats (specified by logj2)
 * @private
 * @type {{DEFAULT: string, ABSOLUTE: string, COMPACT: string, DATE: string, ISO8601: string, ISO8601_BASIC: string}}
 */
const _PREDEFINED = {
    'DEFAULT' : 'yyyy-MM-dd HH:mm:ss,S',
    'ABSOLUTE' : 'HH:MM:ss,S',
    'COMPACT' : 'yyyyMMddHHmmssS',
    'DATE' : 'dd MMM yyyy HH:mm:ss,S',
    'ISO8601' : 'yyyy-MM-ddTHH:mm:ss,S',
    'ISO8601_BASIC' : 'yyyyMMddTHHmmss,S'
};

/**
 * Pads numbers in the date format
 *
 * @param value
 * @param length
 *
 * @returns {?string}
 */
function pad(value, length) {

    value = String(value);
	length = length || 2;

    while (value.length < length) {
		value = '0' + value;
	}

	return value;

}

/**
 * Formats the date
 * @param date
 * @param mask
 * @returns {string}
 */
export function dateFormat(date, mask) {

    if (_PREDEFINED[mask]) {
        mask = _PREDEFINED[mask];
    } else {
        mask = String(mask || _PREDEFINED.DEFAULT);
    }

    // check if the date format is set for UTC
    let isUTC = (mask.slice(0, 4) == 'UTC:');
	if (isUTC) {
		mask = mask.slice(4);
	}

	let prefix = isUTC ? 'getUTC' : 'get';
	let day = date[prefix + 'Day']();
	let month = date[prefix + 'Month']();
	let fullYear = date[prefix + 'FullYear']();
	let hours = date[prefix + 'Hours']();
	let minutes = date[prefix + 'Minutes']();
	let seconds = date[prefix + 'Seconds']();
	let milliseconds = date[prefix + 'Milliseconds']();
	let offset = isUTC ? 0 : date.getTimezoneOffset();

	let flags = {
		'd' : date.getDate(),
		'dd' : pad(date.getDate()),
		'ddd' : i18n.d[day],
		'dddd' : i18n.d[day + 7],
		'M' : month + 1,
		'MM' : pad(month + 1),
		'MMM' : i18n.m[month],
		'MMMM' : i18n.m[month + 12],
		'yy' : String(fullYear).slice(2),
		'yyyy' : fullYear,
		'h' : hours % 12 || 12,
		'hh' : pad(hours % 12 || 12),
		'H' : hours,
		'HH' : pad(hours),
		'm' : minutes,
		'mm' : pad(minutes),
		's' : seconds,
		'ss' : pad(seconds),
		'S' : pad(milliseconds, 1),
		'a' : hours < 12 ? 'a' : 'p',
		'aa' : hours < 12 ? 'am' : 'pm',
		'A' : hours < 12 ? 'A' : 'P',
		'AA' : hours < 12 ? 'AM' : 'PM',
		'Z' : isUTC ? 'UTC' : (String(date).match(TIMEZONE) || [ '' ]).pop().replace(TIMEZONE_CLIP, ''),
		'o' : (offset > 0 ? '-' : '+') + pad(Math.floor(Math.abs(offset) / 60) * 100 + Math.abs(offset) % 60, 4)
	};

	return mask.replace(TOKEN, function ($0) {
		return $0 in flags ? flags[$0] : $0;
	});

}
