/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */;// Copyright by Ivan Kubota. 1/8/2017

module.exports = (function(){
    'use strict';
    var getData = function(item){
        return item.data;
    };

    var process = function (tokens) {
        var i, _i, token, data, lastData, start, begin, end, delta, URI;
        for(i = 0, _i = tokens.length; i < _i; i++){
            token = tokens[i];
            data = token.data;

            if(data ==='/' && lastData === '/'){
                start = i-1;
                URI = false;
                if(start>1 && i <_i-2) {

                    if(
                        tokens[start - 1].data === ':' &&
                        tokens[start - 2].type === 'WORD' &&
                        tokens[start + 2].type === 'WORD'
                    ){
                        URI = true;
                        for(begin = start-2;begin>-1;begin--){
                            token = tokens[begin];
                            if(
                                token.type!=='WORD' &&
                                token.type!=='DOT' &&
                                token.data!=='-'
                            ){
                                /* schema protocol specification tells us that protocol name contains:
                                    letters, dots, +, -.
                                   But actually used are only: words, dots, -
                                 */
                                begin++;
                                break;
                            }
                        }

                        for(end = start + 2;end<_i;end++){
                            token = tokens[end];
                            if(
                                token.type!=='WORD' &&
                                token.type!=='DOT' &&
                                token.data!=='-' &&
                                token.data!=='#' &&
                                token.data!=='+' &&
                                token.data!=='@'
                            ){
                                /* schema protocol specification tells us that protocol name contains:
                                 letters, dots, +, -.
                                 But actually used are only: words, dots, -
                                 */
                                break;
                            }
                        }
                        tokens.splice(begin, end - begin, {
                            type: 'URI',
                            tokens: tokens.slice(begin, end),
                            data: tokens.slice(begin, end).map(getData).join(''),
                            pointer: tokens[begin].pointer
                        });
                        delta = end-i-1;
                        i -= delta;
                        _i -= end - begin - 1;
                    }

                    //console.log(tokens.slice(i - 3, i + 3).map(getData2))
                }
                if(!URI){
                    for(end = i + 1; end < _i; end++ ){
                        if(tokens[end].type === 'NEWLINE')
                            break;
                    }

                    tokens.splice(start, end - start, {
                        type: 'Comment',
                        tokens: tokens.slice(start, end),
                        data: tokens.slice(start+2, end).map(getData).join(''),
                        _info: 'singleline',
                        pointer: tokens[start].pointer
                    });

                    delta = i - start;
                    i -= delta-1;
                    _i -= end - start - 1;
                }
            }

            lastData = data;
        }
        return tokens;
    };
    return process;
})();