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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFTZ0I7Ozs7Ozs7Ozs7QUFBVCxTQUFTLGVBQVQsQ0FBeUIsSUFBekIsRUFBK0I7OztBQUdsQyxRQUFJLE9BQU8sS0FBSyxRQUFMLEdBQWdCLFNBQWhCLENBQTBCLFlBQVksTUFBWixDQUFqQyxDQUg4QjtBQUlsQyxXQUFPLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsS0FBSyxPQUFMLENBQWEsR0FBYixDQUFsQixDQUFQOzs7QUFKa0MsV0FPM0IsSUFBQyxJQUFRLEtBQUssSUFBTCxFQUFSLEdBQXVCLElBQXhCLEdBQStCLFdBQS9CLENBUDJCO0NBQS9CIiwiZmlsZSI6InV0aWxpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogR2V0cyB0aGUgZnVuY3Rpb24gbmFtZSBvZiB0aGUgc3BlY2lmaWVkIGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0gZnVuY1xyXG4gKlxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bmN0aW9uTmFtZShmdW5jKSB7XHJcblxyXG4gICAgLy8gZ2V0IHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvblxyXG4gICAgbGV0IG5hbWUgPSBmdW5jLnRvU3RyaW5nKCkuc3Vic3RyaW5nKCdmdW5jdGlvbiAnLmxlbmd0aCk7XHJcbiAgICBuYW1lID0gbmFtZS5zdWJzdHJpbmcoMCwgbmFtZS5pbmRleE9mKCcoJykpO1xyXG5cclxuICAgIC8vIGlmIHRoZSBzdHJpbmcgaXMgbm90IGVtcHR5XHJcbiAgICByZXR1cm4gKG5hbWUgJiYgbmFtZS50cmltKCkpID8gbmFtZSA6ICdhbm9ueW1vdXMnO1xyXG5cclxufVxyXG4iXX0=