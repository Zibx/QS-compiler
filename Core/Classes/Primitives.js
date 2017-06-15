/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 2/15/17.

module.exports = (function () {
    'use strict';

    var evaluteSafe = function(str){
        // TODO: wrap in vm
        return new Function('','return '+str+';')();
    }
    var Property = function (type, text) {
        this.type = type;
        this._description = text;
    };

    var p = function(type, description){
        return new Property(type, description);
    };
    var primitiveInstantiate = function(defaultValue){
        return function(vals){
            if(vals && vals.value)
                return vals.value;
            else
                return defaultValue;
        }
    };
    return {
        String: {
            _description: 'String class (primitive)',
            public: {
                length: p('Number', 'Length of string'),
                value: p('String')
            },
            __compileValue: function(arr, value){
                return JSON.stringify(arr.join(''));
            },
            __instantiate: primitiveInstantiate('""')
        },
        Boolean: {
            public: {
                value: p('Boolean')
            },
            __instantiate: primitiveInstantiate('false')
        },
        Number: {
            public: {
                value: p('Number')
            },
            __compileValue: function(arr, value){
                return arr.join('');
            },
            __instantiate: primitiveInstantiate('0')
        },
        Variant: {
            public: {
                value: p('Variant')
            },
            __compileValue: function(arr, value){
                var result;

                try{
                    return JSON.stringify(evaluteSafe(arr.join('')),null,2)
                }catch(e){
                    if(value && value.length === 1 && value[0].type==='Quote')
                        return JSON.stringify(value[0].data);
                    return JSON.stringify(arr.join(''));
                }
            },
            _anything: true
        },
        Function: {
            public: {
                value: p('Function')
            }
        },
        Array: {
            public: {
                value: p('Array')
            },
            _anything: true
        },
        Event: {
            public: {
                value: p('Array')
            }
        }/*,
        UIComponent: {
            public: {
                opacity: p('Number'),
                background: p('String')
            }
        }*/

    };
})();