/*istanbul ignore next*/'use strict';

exports.__esModule = true;
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
    var name = func.toString().substring('function '.length);
    name = name.substring(0, name.indexOf('('));

    // if the string is not empty
    return name && name.trim() ? name : 'anonymous';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O1FBU2dCOzs7Ozs7Ozs7O0FBQVQsU0FBUyxlQUFULENBQXlCLElBQXpCLEVBQStCOzs7QUFHbEMsUUFBSSxPQUFPLEtBQUssUUFBTCxHQUFnQixTQUFoQixDQUEwQixZQUFZLE1BQVosQ0FBakMsQ0FIOEI7QUFJbEMsV0FBTyxLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBbEIsQ0FBUDs7O0FBSmtDLFdBTzNCLElBQUMsSUFBUSxLQUFLLElBQUwsRUFBUixHQUF1QixJQUF4QixHQUErQixXQUEvQixDQVAyQjtDQUEvQiIsImZpbGUiOiJ1dGlsaXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEdldHMgdGhlIGZ1bmN0aW9uIG5hbWUgb2YgdGhlIHNwZWNpZmllZCBmdW5jdGlvblxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIGZ1bmNcclxuICpcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRGdW5jdGlvbk5hbWUoZnVuYykge1xyXG5cclxuICAgIC8vIGdldCB0aGUgbmFtZSBvZiB0aGUgZnVuY3Rpb25cclxuICAgIGxldCBuYW1lID0gZnVuYy50b1N0cmluZygpLnN1YnN0cmluZygnZnVuY3Rpb24gJy5sZW5ndGgpO1xyXG4gICAgbmFtZSA9IG5hbWUuc3Vic3RyaW5nKDAsIG5hbWUuaW5kZXhPZignKCcpKTtcclxuXHJcbiAgICAvLyBpZiB0aGUgc3RyaW5nIGlzIG5vdCBlbXB0eVxyXG4gICAgcmV0dXJuIChuYW1lICYmIG5hbWUudHJpbSgpKSA/IG5hbWUgOiAnYW5vbnltb3VzJztcclxuXHJcbn1cclxuIl19