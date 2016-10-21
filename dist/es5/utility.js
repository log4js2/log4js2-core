/*istanbul ignore next*/'use strict';

exports.__esModule = true;
exports.getFunctionName = getFunctionName;
function getFunctionName(func) {

    if (typeof func !== 'function') {
        return 'anonymous';
    }

    var functionName = func.toString();
    functionName = functionName.substring('function '.length);
    functionName = functionName.substring(0, functionName.indexOf('('));

    return functionName !== '' ? functionName : 'anonymous';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O1FBQWdCO0FBQVQsU0FBUyxlQUFULENBQXlCLElBQXpCLEVBQStCOztBQUVsQyxRQUFJLE9BQU8sSUFBUCxLQUFnQixVQUFoQixFQUE0QjtBQUM1QixlQUFPLFdBQVAsQ0FENEI7S0FBaEM7O0FBSUEsUUFBSSxlQUFlLEtBQUssUUFBTCxFQUFmLENBTjhCO0FBT2xDLG1CQUFlLGFBQWEsU0FBYixDQUF1QixZQUFZLE1BQVosQ0FBdEMsQ0FQa0M7QUFRbEMsbUJBQWUsYUFBYSxTQUFiLENBQXVCLENBQXZCLEVBQTBCLGFBQWEsT0FBYixDQUFxQixHQUFyQixDQUExQixDQUFmLENBUmtDOztBQVVsQyxXQUFPLFlBQUMsS0FBaUIsRUFBakIsR0FBdUIsWUFBeEIsR0FBdUMsV0FBdkMsQ0FWMkI7Q0FBL0IiLCJmaWxlIjoidXRpbGl0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBnZXRGdW5jdGlvbk5hbWUoZnVuYykge1xyXG5cclxuICAgIGlmICh0eXBlb2YgZnVuYyAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiAnYW5vbnltb3VzJztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZnVuY3Rpb25OYW1lID0gZnVuYy50b1N0cmluZygpO1xyXG4gICAgZnVuY3Rpb25OYW1lID0gZnVuY3Rpb25OYW1lLnN1YnN0cmluZygnZnVuY3Rpb24gJy5sZW5ndGgpO1xyXG4gICAgZnVuY3Rpb25OYW1lID0gZnVuY3Rpb25OYW1lLnN1YnN0cmluZygwLCBmdW5jdGlvbk5hbWUuaW5kZXhPZignKCcpKTtcclxuXHJcbiAgICByZXR1cm4gKGZ1bmN0aW9uTmFtZSAhPT0gJycpID8gZnVuY3Rpb25OYW1lIDogJ2Fub255bW91cyc7XHJcblxyXG59XHJcbiJdfQ==