let i18n = {
	dayNames : [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday",
		"Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
	monthNames : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
		"Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December" ]
};

let token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
let timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
let timezoneClip = /[^-+\dA-Z]/g;

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
		value = "0" + value;
	}
	return value;
}

export function dateFormat (date, mask, utc) {

	// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
	if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
		mask = date;
		date = undefined;
	}

	// Passing date through Date applies Date.parse, if necessary
	date = date ? new Date(date) : new Date;
	if (isNaN(date))
		throw SyntaxError("invalid date");

	mask = String(mask || 'yyyy-mm-dd HH:MM:ss,S');

	// Allow setting the utc argument via the mask
	if (mask.slice(0, 4) == "UTC:") {
		mask = mask.slice(4);
		utc = true;
	}

	let _ = utc ? "getUTC" : "get";
	let d = date[_ + "Date"]();
	let D = date[_ + "Day"]();
	let m = date[_ + "Month"]();
	let y = date[_ + "FullYear"]();
	let H = date[_ + "Hours"]();
	let M = date[_ + "Minutes"]();
	let s = date[_ + "Seconds"]();
	let L = date[_ + "Milliseconds"]();
	let o = utc ? 0 : date.getTimezoneOffset();
	let flags = {
		d : d,
		dd : pad(d),
		ddd : i18n.dayNames[D],
		dddd : i18n.dayNames[D + 7],
		M : m + 1,
		MM : pad(m + 1),
		MMM : i18n.monthNames[m],
		MMMM : i18n.monthNames[m + 12],
		yy : String(y).slice(2),
		yyyy : y,
		h : H % 12 || 12,
		hh : pad(H % 12 || 12),
		H : H,
		HH : pad(H),
		m : M,
		mm : pad(M),
		s : s,
		ss : pad(s),
		S : pad(L, 1),
		t : H < 12 ? "a" : "p",
		tt : H < 12 ? "am" : "pm",
		T : H < 12 ? "A" : "P",
		TT : H < 12 ? "AM" : "PM",
		Z : utc ? "UTC" : (String(date).match(timezone) || [ "" ]).pop().replace(timezoneClip, ""),
		o : (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
	};

	return mask.replace(token, function($0) {
		return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
	});

}
