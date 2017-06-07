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
    var quotes = {'\'': 1, '"': 1};
    // It is a hardcoded plain function for only one purpose
    // Fuck the beauty, it just do the job
    var process = function (tokens) {

        var i, _i, token, data, count, quoteType,
            start, need, delta;

        for (i = 0, _i = tokens.length; i < _i; i++) {
            token = tokens[i];

            data = token.data;
            if (quotes[data]) {
                quoteType = data;
                count = 1;
                start = i;

                for (i++; i < _i; i++) {
                    token = tokens[i];
                    if (token.data === quoteType) {
                        count++;
                    } else {
                        i--;
                        break;
                    }
                }

                if (count % 2 === 0) {
                    // open and close
                    tokens.splice(start, count, {
                        type: 'Quote',
                        tokens: tokens.slice(start, start+count),
                        data: '',
                        _info: tokens.slice(start, start+count/2).map(getData).join(''),
                        pointer: tokens[start].pointer,
                        _data: tokens.slice(start, start+count).map(getData).join('')
                    });

                    i -= count;
                    _i -= count-1;

                } else {
                    need = count;
                    count = 0;
                    var escapes = {};
                    for (i++; i < _i; i++) {
                        token = tokens[i];
                        if(token.data === '\\') {
                            escapes[i-start+need-2] = true;
                            i++;
                        }
                        if (token.data === quoteType) {
                            count++;
                            if(count === need) {
                                delta = i-start;
                                tokens.splice(start, delta+1, {
                                    type: 'Quote',
                                    tokens: tokens.slice(start+need, i+1-need),
                                    data: tokens.slice(start+need, i+1-need).filter(function(el,i){return !(i in escapes);}).map(getData).join(''),
                                    _info: tokens.slice(start, start+need).map(getData).join(''),
                                    pointer: tokens[start].pointer,
                                    _data: tokens.slice(start, i+1).map(getData).join('')
                                });

                                //todo check this
                                i -= delta;
                                _i -= delta;
                                break;
                            }
                        } else {
                            i -= count;
                            count = 0;
                        }
                    }
                }

            }else if(data === '/' && i < _i - 1 && tokens[i+1].data === '*'){
                // long comment case
                start = i;
                for (i++; i < _i; i++) {
                    token = tokens[i];
                    if (token.data === '*' && tokens[i+1].data === '/') {
                        // this is the end
                        delta = i - start+2;

                        tokens.splice(start, delta, {
                            type: 'Comment',
                            tokens: tokens.slice(start, start + delta),
                            data: tokens.slice(start+2, start+delta-2).map(getData).join(''),
                            _info: 'multiline',
                            pointer: tokens[start].pointer
                        });
                        i-=delta-1;
                        _i-=delta-1;

                        break;
                    }
                }
            }

        }

        return tokens;
    };

    return process;
})();