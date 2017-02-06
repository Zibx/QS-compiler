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
        lexer = require('../Core/Preprocess'),
        fs = require('fs');

    describe('Preprocessor', function() {

        it('tokenize', function () {
            var data = fs.readFileSync('test/qs/example.qs')+'',
                tokens = tokenizer(data, 'example.qs'),
                lex = lexer(tokens);
debugger;
            console.log(lex)
        });
        it('quotes', function () {
            var getTokens = function(text){
                var tokens = tokenizer(text, 'example.qs');
                return lexer.quotesAndLongComments(tokens);
            };

            var token = getTokens('"HA!"')[0];
            assert.equal(token.data,'HA!');
            assert.equal(token.type,'Quote');

            token = getTokens('"HA!" ')[0];
            assert.equal(token.data,'HA!');
            assert.equal(token.type,'Quote');

            token = getTokens(' "HA!" ')[1];
            assert.equal(token.data,'HA!');
            assert.equal(token.type,'Quote');

            token = getTokens(' \'HA!\' ')[1];
            assert.equal(token.data,'HA!');
            assert.equal(token.type,'Quote');

            token = getTokens(' """H"A!""" ')[1];
            assert.equal(token.data,'H"A!');
            assert.equal(token.type,'Quote');

            token = getTokens(' "H\\"A!" ')[1];
            assert.equal(token.data,'H"A!');
            assert.equal(token.type,'Quote');


        })
    });
})();