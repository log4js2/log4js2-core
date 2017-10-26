/**
 * log4js <https://github.com/anigenero/log4js2>
 *
 * Copyright 2016-present Robin Schultz <http://anigenero.com>
 * Released under the MIT License
 */

export default class DateFormatter {

    private static readonly i18n = {
        'd': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday',
            'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'm': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December']
    };

    private static readonly TOKEN = /d{1,4}|M{1,4}|yy(?:yy)?|([HhmsAa])\1?|[LloSZ]|'[^']*'|'[^']*'/g;
    private static readonly TIMEZONE = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
    private static readonly TIMEZONE_CLIP = /[^-+\dA-Z]/g;

    /**
     * Predefined DATE formats (specified by logj2)
     * @private
     * @type {{DEFAULT: string, ABSOLUTE: string, COMPACT: string, DATE: string, ISO8601: string, ISO8601_BASIC: string}}
     */
    private static readonly _PREDEFINED = {
        'DEFAULT': 'yyyy-MM-dd HH:mm:ss,S',
        'ABSOLUTE': 'HH:MM:ss,S',
        'COMPACT': 'yyyyMMddHHmmssS',
        'DATE': 'dd MMM yyyy HH:mm:ss,S',
        'ISO8601': 'yyyy-MM-ddTHH:mm:ss,S',
        'ISO8601_BASIC': 'yyyyMMddTHHmmss,S'
    };

    /**
     * Pads numbers in the date format
     *
     * @param value
     * @param length
     *
     * @returns {?string}
     */
    private static _pad(value: number, length?: number): string {

        let str: string = '' + value;
        length = length || 2;

        while (str.length < length) {
            str = '0' + str;
        }

        return str;

    }

    /**
     * Formats the date
     *
     * @function
     * @memberOf DateFormatter
     *
     * @param date {Date}
     * @param mask {string}
     *
     * @returns {string}
     */
    public static format(date: Date, mask?: string): string {

        if (DateFormatter._PREDEFINED[mask]) {
            mask = DateFormatter._PREDEFINED[mask];
        } else {
            mask = String(mask || DateFormatter._PREDEFINED.DEFAULT);
        }

        // check if the date format is set for UTC
        let isUTC = (mask.slice(0, 4) == 'UTC:');
        if (isUTC) {
            mask = mask.slice(4);
        }

        let prefix: string = isUTC ? 'getUTC' : 'get';

        let day: number = date[prefix + 'Day']();
        let month: number = date[prefix + 'Month']();
        let fullYear: number = date[prefix + 'FullYear']();
        let hours: number = date[prefix + 'Hours']();
        let minutes: number = date[prefix + 'Minutes']();
        let seconds: number = date[prefix + 'Seconds']();
        let milliseconds: number = date[prefix + 'Milliseconds']();
        let offset: number = isUTC ? 0 : date.getTimezoneOffset();

        let flags = {
            'd': date.getDate(),
            'dd': DateFormatter._pad(date.getDate()),
            'ddd': DateFormatter.i18n.d[day],
            'dddd': DateFormatter.i18n.d[day + 7],
            'M': month + 1,
            'MM': DateFormatter._pad(month + 1),
            'MMM': DateFormatter.i18n.m[month],
            'MMMM': DateFormatter.i18n.m[month + 12],
            'yy': String(fullYear).slice(2),
            'yyyy': fullYear,
            'h': hours % 12 || 12,
            'hh': DateFormatter._pad(hours % 12 || 12),
            'H': hours,
            'HH': DateFormatter._pad(hours),
            'm': minutes,
            'mm': DateFormatter._pad(minutes),
            's': seconds,
            'ss': DateFormatter._pad(seconds),
            'S': DateFormatter._pad(milliseconds, 1),
            'a': hours < 12 ? 'a' : 'p',
            'aa': hours < 12 ? 'am' : 'pm',
            'A': hours < 12 ? 'A' : 'P',
            'AA': hours < 12 ? 'AM' : 'PM',
            'Z': isUTC ? 'UTC' : (String(date).match(DateFormatter.TIMEZONE) || ['']).pop().replace(DateFormatter.TIMEZONE_CLIP, ''),
            'o': (offset > 0 ? '-' : '+') + DateFormatter._pad(Math.floor(Math.abs(offset) / 60) * 100 + Math.abs(offset) % 60, 4)
        };

        return mask.replace(DateFormatter.TOKEN, function ($0) {
            return $0 in flags ? flags[$0] : $0;
        });

    }

}
