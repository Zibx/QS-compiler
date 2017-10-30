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
    /*var plainify = function(value){
        var vals = value.map(function(item){
            if()
        });
        if(vals.value.match(/^(["']).*(\1)$/) !== null){
            // Quotes wrapped
            return JSON.stringify(vals.value.substr(1, vals.value.length - 2));
        }else{
            // Shit encrusted
            return JSON.stringify(vals.value);
        }

        if(value && value.length === 1 && value[0].type==='Quote')
            return JSON.stringify(value[0].data);
    };*/
    var tools = require('../tokenTools');

    var out = {
        String: {
            _description: 'String class (primitive)',
            public: {
                length: p('Number', 'Length of string'),
                value: p('String')
            },
            __compileValue: function(arr, value){
                if(Array.isArray(value) && value.length) {
                    var result = tools.toString(value, [], void 0, {comments: false}).data.trim();
                    if(result.match(/^(["']).*(\1)$/) !== null){
                        return JSON.stringify(result.substr(1, result.length - 2));
                    }else{
                        return JSON.stringify(result);
                    }
                }else
                    return '""';
            },
            __instantiate: function(vals){
                if(vals && vals.value) {
                    if(vals.value.match(/^(["']).*(\1)$/) !== null){
                        // Quotes wrapped
                        return JSON.stringify(vals.value.substr(1, vals.value.length - 2));
                    }else{
                        // Shit encrusted
                        return JSON.stringify(vals.value);
                    }

                }else
                    return '""';
            }
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
                    var safe = evaluteSafe(arr.join(''));
                    if(typeof safe === 'function')
                        throw new Error('Constructors are not allowed');
                    return JSON.stringify(safe,null,2)
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
                value: p('Array'),
                slice: p('Function')
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
    for(var i in out)
        out[i].ready = true;
    return out;
})();