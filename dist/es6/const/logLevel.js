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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnN0L2xvZ0xldmVsLmpzIl0sIm5hbWVzIjpbIkxvZ0xldmVsIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBOzs7Ozs7O0FBT0E7OztBQUdPLE1BQU1BLHNEQUFXO0FBQ3BCLFNBQVEsQ0FEWTtBQUVwQixXQUFVLEdBRlU7QUFHcEIsV0FBVSxHQUhVO0FBSXBCLFVBQVMsR0FKVztBQUtwQixVQUFTLEdBTFc7QUFNcEIsV0FBVSxHQU5VO0FBT3BCLFdBQVUsR0FQVTtBQVFwQixTQUFRO0FBUlksQ0FBakIiLCJmaWxlIjoiY29uc3QvbG9nTGV2ZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGxvZzRqcyA8aHR0cHM6Ly9naXRodWIuY29tL2FuaWdlbmVyby9sb2c0anM+XG4gKlxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCBSb2JpbiBTY2h1bHR6IDxodHRwOi8vYW5pZ2VuZXJvLmNvbT5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxuICovXG5cbi8qKlxuICogQHR5cGUge3tPRkY6IG51bWJlciwgRkFUQUw6IG51bWJlciwgRVJST1I6IG51bWJlciwgV0FSTjogbnVtYmVyLCBJTkZPOiBudW1iZXIsIERFQlVHOiBudW1iZXIsIFRSQUNFOiBudW1iZXIsIEFMTDogbnVtYmVyfX1cbiAqL1xuZXhwb3J0IGNvbnN0IExvZ0xldmVsID0ge1xuICAgICdPRkYnIDogMCxcbiAgICAnRkFUQUwnIDogMTAwLFxuICAgICdFUlJPUicgOiAyMDAsXG4gICAgJ1dBUk4nIDogMzAwLFxuICAgICdJTkZPJyA6IDQwMCxcbiAgICAnREVCVUcnIDogNTAwLFxuICAgICdUUkFDRScgOiA2MDAsXG4gICAgJ0FMTCcgOiAyMTQ3NDgzNjQ3XG59O1xuIl19