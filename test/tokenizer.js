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

    describe('Tokenizer', function() {

        it('tokenize', function () {
            var data = fs.readFileSync('test/qs/example.qs')+'';
            console.log(tokenizer(data, 'example.qs'))
        })
    });
})();