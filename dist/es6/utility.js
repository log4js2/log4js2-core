/*istanbul ignore next*/'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFunctionName = getFunctionName;
/**
 * Gets the function name of the specified function
 *
 * @function
 *
 * @param func
 *
 * @returns {string}
 */
function getFunctionName(func) {

  // get the name of the function
  let name = func.toString().substring('function '.length);
  name = name.substring(0, name.indexOf('('));

  // if the string is not empty
  return name && name.trim() ? name : 'anonymous';
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdHkuanMiXSwibmFtZXMiOlsiZ2V0RnVuY3Rpb25OYW1lIiwiZnVuYyIsIm5hbWUiLCJ0b1N0cmluZyIsInN1YnN0cmluZyIsImxlbmd0aCIsImluZGV4T2YiLCJ0cmltIl0sIm1hcHBpbmdzIjoiOzs7OztRQVNnQkEsZSxHQUFBQSxlO0FBVGhCOzs7Ozs7Ozs7QUFTTyxTQUFTQSxlQUFULENBQXlCQyxJQUF6QixFQUErQjs7QUFFbEM7QUFDQSxNQUFJQyxPQUFPRCxLQUFLRSxRQUFMLEdBQWdCQyxTQUFoQixDQUEwQixZQUFZQyxNQUF0QyxDQUFYO0FBQ0FILFNBQU9BLEtBQUtFLFNBQUwsQ0FBZSxDQUFmLEVBQWtCRixLQUFLSSxPQUFMLENBQWEsR0FBYixDQUFsQixDQUFQOztBQUVBO0FBQ0EsU0FBUUosUUFBUUEsS0FBS0ssSUFBTCxFQUFULEdBQXdCTCxJQUF4QixHQUErQixXQUF0QztBQUVIIiwiZmlsZSI6InV0aWxpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEdldHMgdGhlIGZ1bmN0aW9uIG5hbWUgb2YgdGhlIHNwZWNpZmllZCBmdW5jdGlvblxuICpcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSBmdW5jXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bmN0aW9uTmFtZShmdW5jKSB7XG5cbiAgICAvLyBnZXQgdGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uXG4gICAgbGV0IG5hbWUgPSBmdW5jLnRvU3RyaW5nKCkuc3Vic3RyaW5nKCdmdW5jdGlvbiAnLmxlbmd0aCk7XG4gICAgbmFtZSA9IG5hbWUuc3Vic3RyaW5nKDAsIG5hbWUuaW5kZXhPZignKCcpKTtcblxuICAgIC8vIGlmIHRoZSBzdHJpbmcgaXMgbm90IGVtcHR5XG4gICAgcmV0dXJuIChuYW1lICYmIG5hbWUudHJpbSgpKSA/IG5hbWUgOiAnYW5vbnltb3VzJztcblxufVxuIl19