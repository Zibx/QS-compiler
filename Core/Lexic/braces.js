/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */;// Copyright by Ivan Kubota. 1/8/2017

module.exports = (function(){
    'use strict';

    var braces = {
        '(': ')',
        '{': '}',
        '[': ']'
    };

    var possible = {
        BRACE: true,
        SQUARE_BRACE: true,
        CURVED_BRACE: true
    };
    var getData = function(item){
        return item.data;
    };
    // It is a hardcoded plain function for only one purpose
    // Fuck the beauty, it just do the job
    var process = function (tokens) {
        var i, _i, token, delta,

            stack = [], last;

        for( i = 0, _i = tokens.length; i<_i;i++){
            token = tokens[i];
            if(token.type in possible){
                if(token.data in braces) {
                    last = {info: token.data, wait: braces[token.data], start: i};
                    stack.push(last);
                }else{
                    if(token.data === last.wait){
                        // close one
                        //console.log(tokens.slice(last.start, i+1).map(getData))
                        stack.pop();
                        delta = i - last.start+1;
                        tokens.splice(last.start, delta, {
                            type: 'Brace',
                            info: last.info,
                            _info: last.wait,
                            data: tokens.slice(last.start, i+1).map(getData).join(''),
                            tokens: tokens.slice(last.start, i+1),
                            pointer: tokens[last.start].pointer
                        });
                        i -= delta;
                        _i -= delta - 1;
                        if(_i!== tokens.length)debugger;
                        last = stack[stack.length - 1];
                    }else{
                        throw new Error('NET')
                    }
                }
            }
        }
        if(stack.length)
            throw new Error('MNOGO')
        return tokens;
    };

    return process;
})();