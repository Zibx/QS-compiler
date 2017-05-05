/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2016
// By zibx on 12/22/16.

module.exports = (function () {
    'use strict';
    var assert = require('chai').assert;
    var tokenizer = require('../Core/Tokenizer'),
        fs = require('fs');

    var getToken = function (tokens, row, col) {
        var result = tokens.filter(function(token){
            var pointer = token.pointer;
            return pointer.row === row && pointer.col === col;
        });
        return result.length ? result[0] : {data: null, cursor: {}};
    };
    describe('Tokenizer', function() {

        it('tokenize', function () {
            var data = fs.readFileSync('test/qs/example.qs')+'',
                tokens = tokenizer(data, 'example.qs');

            assert.equal(getToken(tokens, 25, 8).type, 'DOT');
            assert.equal(getToken(tokens, 25, 9).data, 'leave');
        })
    });
})();