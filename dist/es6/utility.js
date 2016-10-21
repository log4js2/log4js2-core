/*istanbul ignore next*/'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFunctionName = getFunctionName;
function getFunctionName(func) {

    if (typeof func !== 'function') {
        return 'anonymous';
    }

    let functionName = func.toString();
    functionName = functionName.substring('function '.length);
    functionName = functionName.substring(0, functionName.indexOf('('));

    return functionName !== '' ? functionName : 'anonymous';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFBZ0I7QUFBVCxTQUFTLGVBQVQsQ0FBeUIsSUFBekIsRUFBK0I7O0FBRWxDLFFBQUksT0FBTyxJQUFQLEtBQWdCLFVBQWhCLEVBQTRCO0FBQzVCLGVBQU8sV0FBUCxDQUQ0QjtLQUFoQzs7QUFJQSxRQUFJLGVBQWUsS0FBSyxRQUFMLEVBQWYsQ0FOOEI7QUFPbEMsbUJBQWUsYUFBYSxTQUFiLENBQXVCLFlBQVksTUFBWixDQUF0QyxDQVBrQztBQVFsQyxtQkFBZSxhQUFhLFNBQWIsQ0FBdUIsQ0FBdkIsRUFBMEIsYUFBYSxPQUFiLENBQXFCLEdBQXJCLENBQTFCLENBQWYsQ0FSa0M7O0FBVWxDLFdBQU8sWUFBQyxLQUFpQixFQUFqQixHQUF1QixZQUF4QixHQUF1QyxXQUF2QyxDQVYyQjtDQUEvQiIsImZpbGUiOiJ1dGlsaXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bmN0aW9uTmFtZShmdW5jKSB7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuICdhbm9ueW1vdXMnO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBmdW5jdGlvbk5hbWUgPSBmdW5jLnRvU3RyaW5nKCk7XHJcbiAgICBmdW5jdGlvbk5hbWUgPSBmdW5jdGlvbk5hbWUuc3Vic3RyaW5nKCdmdW5jdGlvbiAnLmxlbmd0aCk7XHJcbiAgICBmdW5jdGlvbk5hbWUgPSBmdW5jdGlvbk5hbWUuc3Vic3RyaW5nKDAsIGZ1bmN0aW9uTmFtZS5pbmRleE9mKCcoJykpO1xyXG5cclxuICAgIHJldHVybiAoZnVuY3Rpb25OYW1lICE9PSAnJykgPyBmdW5jdGlvbk5hbWUgOiAnYW5vbnltb3VzJztcclxuXHJcbn1cclxuIl19