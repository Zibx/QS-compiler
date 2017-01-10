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
    var process = function (tokens) {

        var i, _i, token, data, count, quoteType,
            start, need;

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
                    var d, trash = tokens.splice(start, count, d={
                        type: 'Quote',
                        tokens: tokens.slice(start, start+count),
                        data: '',
                        _info: tokens.slice(start, start+count/2).map(getData).join('')
                    });
                    i -= count;
                    _i -= count;

                } else {
                    need = count;
                    count = 0;

                    for (i++; i < _i; i++) {
                        token = tokens[i];
                        if (token.data === quoteType) {
                            count++;
                            if(count === need) {

                                console.log(tokens.slice(start,i+1).map(getData).join(''))
                                break;
                            }
                        } else {
                            i -= count;
                            count = 0;
                        }
                    }
                    console.log(count);
                }

            }

        }

    };

    return process;
})();