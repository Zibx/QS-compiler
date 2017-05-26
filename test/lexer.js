/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 5/26/17.

module.exports = (function () {
    'use strict';
    var assert = require('chai').assert;
    var tokenizer = require('../Core/Tokenizer'),
        lexer = require('../Core/Preprocess'),
        ast = require('../Core/Lexic/ast');

    var getData = function(i){
        return i.data;
    };

    describe('Lexer', function() {
        it('should match cls', function(){
            var tokens = tokenizer('div.wrap', 'test'),
                lex = lexer(tokens, true);

            var matched = ast.matchers.prop(lex.children[0]);
            assert.equal(matched.name, void 0);
            assert.equal(matched.class.data, 'div');
            assert.equal(matched.cls.map(getData).join(''), '.wrap');
        });
        it('should not match name', function(){
            var tokens = tokenizer('div.wrap:', 'test'),
                lex = lexer(tokens, true);

            var matched = ast.matchers.prop(lex.children[0]);
            assert.equal(matched.name, void 0);
            assert.equal(matched.class.data, 'div');
            assert.equal(matched.cls.map(getData).join(''), '.wrap');
        });

        it('should match name', function(){
            var tokens = tokenizer('div.wrap d:', 'test'),
                lex = lexer(tokens, true);

            var matched = ast.matchers.prop(lex.children[0]);
            assert.equal(matched.name.data, 'd');
            assert.equal(matched.class.data, 'div');
            assert.equal(matched.cls.map(getData).join(''), '.wrap');
        });
        it('should match cls once', function(){
            var tokens = tokenizer('tr.propertyRow.{{own?"own":""}}:', 'test'),
                lex = lexer(tokens, true);

            var matched = ast.matchers.prop(lex.children[0]);
            assert.equal(matched.name, void 0);
            assert.equal(matched.class.data, 'tr');
            assert.equal(matched.cls.map(getData).join(''), '.propertyRow.own?"own":""');
        });
    });
})();