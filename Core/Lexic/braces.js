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
        return '_data' in item ? item._data:item.data;
    };
    // It is a hardcoded plain function for only one purpose
    // Fuck the beauty, it just do the job
    var process = function (tokens, silent) {
        var i, _i, token, delta,

            stack = [], last = {wait: Infinity};

        for( i = 0, _i = tokens.length; i<_i;i++){
            token = tokens[i];
            if(token.type in possible){
                if(token.data in braces) {
                    last = {info: token.data, wait: braces[token.data], start: i, pointer: token.pointer};
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
                        //if(_i!== tokens.length)debugger;
                        last = stack[stack.length - 1];
                        if(last === void 0 && silent){
                            /*if(!silent)
                                console.log('Closed more than opened');*/
                            break;
                        }
                    }else{
                        if(!silent)
                            throw new Error('Brace dismatch: opened - `'+ last.info +'` at '+ last.pointer +' income - `'+ token.data +'` at '+token.pointer)
                        else
                            break;
                    }
                }
            }
        }
        if(stack.length){
            if( !silent )

                throw new Error( 'Unclosed braces:\n' + stack.map( function( token ){
                        var waiter = tokens[token.start].pointer;
                        return '\t' + token.info + ' at (' + waiter.source + ':' + waiter.row + ':' + waiter.col + ')';
                    } ).join( '\n' ) );
        }

        return tokens.map(function(token){
            var subToken;
            if(token.type === 'Brace' && token.info === '{' && token.tokens.length === 3){
                subToken = token.tokens[1];
                if(subToken.type === 'Brace' && subToken.info === '{'){
                    return {
                        type: 'PIPE',
                        tokens: subToken.tokens.slice(1, subToken.tokens.length - 1),
                        pointer: token.pointer,
                        data: subToken.data.substr(1, subToken.data.length - 2)
                    };
                }
            }
            return token;
        });
    };

    return process;
})();