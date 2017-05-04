/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 2/15/17.

module.exports = (function () {
    'use strict';
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