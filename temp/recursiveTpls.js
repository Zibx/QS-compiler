/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2018
// By zibx on 3/1/18.

module.exports = (function(){
    'use strict';
    var matched = {};
    matched.value = [
        {
            "type": "Quote",
            "tokens": [
                {
                    "data": "test",
                    "pointer": {
                        "col": 16,
                        "row": 7
                    },
                    "type": "WORD",
                    "leaf": true
                },
                {
                    "data": " ",
                    "pointer": {
                        "col": 20,
                        "row": 7
                    },
                    "type": "SPACE",
                    "leaf": true
                },
                {
                    "data": "it",
                    "pointer": {
                        "col": 21,
                        "row": 7
                    },
                    "type": "WORD",
                    "leaf": true
                },
                {
                    "data": " ",
                    "pointer": {
                        "col": 23,
                        "row": 7
                    },
                    "type": "SPACE",
                    "leaf": true
                },
                {
                    "data": "$",
                    "pointer": {
                        "col": 24,
                        "row": 7
                    },
                    "type": "SPECIAL",
                    "leaf": true
                },
                {
                    "data": "{",
                    "pointer": {
                        "col": 25,
                        "row": 7
                    },
                    "type": "CURVED_BRACE",
                    "leaf": true
                },
                {
                    "data": "s0",
                    "pointer": {
                        "col": 26,
                        "row": 7
                    },
                    "type": "WORD",
                    "leaf": true
                },
                {
                    "data": ">",
                    "pointer": {
                        "col": 28,
                        "row": 7
                    },
                    "type": "COMPARE",
                    "leaf": true
                },
                {
                    "data": "30",
                    "pointer": {
                        "col": 29,
                        "row": 7
                    },
                    "type": "WORD",
                    "leaf": true
                },
                {
                    "data": "?",
                    "pointer": {
                        "col": 31,
                        "row": 7
                    },
                    "type": "QUESTION",
                    "leaf": true
                },
                {
                    "data": "30",
                    "pointer": {
                        "col": 32,
                        "row": 7
                    },
                    "type": "WORD",
                    "leaf": true
                },
                {
                    "data": ":",
                    "pointer": {
                        "col": 34,
                        "row": 7
                    },
                    "type": "SEMICOLON",
                    "leaf": true
                }
            ],
            "data": "test it ${s0>30?30:",
            "_info": "`",
            "pointer": {
                "col": 15,
                "row": 7
            },
            "_data": "`test it ${s0>30?30:`"
        },
        {
            "data": "$",
            "pointer": {
                "col": 36,
                "row": 7
            },
            "type": "SPECIAL",
            "leaf": true
        },
        {
            "type": "Brace",
            "info": "{",
            "_info": "}",
            "data": "{s0}",
            "tokens": [
                {
                    "data": "{",
                    "pointer": {
                        "col": 37,
                        "row": 7
                    },
                    "type": "CURVED_BRACE",
                    "leaf": true
                },
                {
                    "data": "s0",
                    "pointer": {
                        "col": 38,
                        "row": 7
                    },
                    "type": "WORD",
                    "leaf": true
                },
                {
                    "data": "}",
                    "pointer": {
                        "col": 40,
                        "row": 7
                    },
                    "type": "CURVED_BRACE",
                    "leaf": true
                }
            ],
            "pointer": {
                "col": 37,
                "row": 7
            }
        },
        {
            "type": "Quote",
            "tokens": [
                {
                    "data": "}",
                    "pointer": {
                        "col": 42,
                        "row": 7
                    },
                    "type": "CURVED_BRACE",
                    "leaf": true
                }
            ],
            "data": "}",
            "_info": "`",
            "pointer": {
                "col": 41,
                "row": 7
            },
            "_data": "`}`"
        }
    ];
    var matchRecursive = function(tokens){
        var i, _i, token, newTokenList = [], tpls = false, tplCounter = 0, escape = false;

        token = tokens[0];
        if(token.type === 'Quote' && token._info === '`'){
            var subTokens = token.tokens;
            for( i = 0, _i = subTokens.length; i < _i; i++){
                var subToken = subTokens[i];
                if(!escape && subToken.type === 'ESCAPE'){
                    escape = true;
                }else if(escape){
                    escape = false;
                }else{
                    
                }
                newTokenList.push(subToken);
            }
            console.log(token)
        }



    }
    matchRecursive(matched.value);
})();