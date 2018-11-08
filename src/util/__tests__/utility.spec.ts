import { getFunctionName } from '../utility';

// tslint:disable:only-arrow-functions
describe('utility', () => {

    test('getFunctionName', () => {

        function namedFunction() {
            // do nothing
        }

        const unnamedFunction = function() {
            // do nothing
        };

        expect(getFunctionName(namedFunction)).toEqual('namedFunction');
        expect(getFunctionName(unnamedFunction)).toEqual('unnamedFunction');
        expect(getFunctionName(() => {
            // do nothing
        })).toEqual('anonymous');
        expect(getFunctionName(function() {
            // do nothing
        })).toEqual('anonymous');

    });

});
