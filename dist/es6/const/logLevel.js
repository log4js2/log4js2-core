/*istanbul ignore next*/'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * log4js <https://github.com/anigenero/log4js>
 *
 * Copyright 2016-present Robin Schultz <http://anigenero.com>
 * Released under the MIT License
 */

/**
 * @type {{OFF: number, FATAL: number, ERROR: number, WARN: number, INFO: number, DEBUG: number, TRACE: number, ALL: number}}
 */
const LogLevel = /*istanbul ignore next*/exports.LogLevel = {
  'OFF': 0,
  'FATAL': 100,
  'ERROR': 200,
  'WARN': 300,
  'INFO': 400,
  'DEBUG': 500,
  'TRACE': 600,
  'ALL': 2147483647
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnN0XFxsb2dMZXZlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFVTyxNQUFNLHNEQUFXO0FBQ3BCLFNBQVEsQ0FBUjtBQUNBLFdBQVUsR0FBVjtBQUNBLFdBQVUsR0FBVjtBQUNBLFVBQVMsR0FBVDtBQUNBLFVBQVMsR0FBVDtBQUNBLFdBQVUsR0FBVjtBQUNBLFdBQVUsR0FBVjtBQUNBLFNBQVEsVUFBUjtDQVJTIiwiZmlsZSI6ImNvbnN0XFxsb2dMZXZlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGUge3tPRkY6IG51bWJlciwgRkFUQUw6IG51bWJlciwgRVJST1I6IG51bWJlciwgV0FSTjogbnVtYmVyLCBJTkZPOiBudW1iZXIsIERFQlVHOiBudW1iZXIsIFRSQUNFOiBudW1iZXIsIEFMTDogbnVtYmVyfX1cclxuICovXHJcbmV4cG9ydCBjb25zdCBMb2dMZXZlbCA9IHtcclxuICAgICdPRkYnIDogMCxcclxuICAgICdGQVRBTCcgOiAxMDAsXHJcbiAgICAnRVJST1InIDogMjAwLFxyXG4gICAgJ1dBUk4nIDogMzAwLFxyXG4gICAgJ0lORk8nIDogNDAwLFxyXG4gICAgJ0RFQlVHJyA6IDUwMCxcclxuICAgICdUUkFDRScgOiA2MDAsXHJcbiAgICAnQUxMJyA6IDIxNDc0ODM2NDdcclxufTtcclxuIl19