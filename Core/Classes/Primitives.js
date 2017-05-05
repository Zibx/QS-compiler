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

    return {
        String: {
            _description: 'String class (primitive)',
            public: {
                length: p('Number', 'Length of string'),
                value: p('String')
            },
            __compileValue: function(arr, value){
                return JSON.stringify(arr.join(''));
            }
        },
        Boolean: {
            public: {
                value: p('Boolean')
            }
        },
        Number: {
            public: {
                value: p('Number')
            },
            __compileValue: function(arr, value){
                return arr.join('');
            }
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
                    return JSON.stringify(arr.join(''));
                }
            }
        },
        Function: {
            public: {
                value: p('Function')
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