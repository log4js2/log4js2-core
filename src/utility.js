export function getFunctionName(func) {

    if (typeof func !== 'function') {
        return 'anonymous';
    }

    let functionName = func.toString();
    functionName = functionName.substring('function '.length);
    functionName = functionName.substring(0, functionName.indexOf('('));

    return (functionName !== '') ? functionName : 'anonymous';

}