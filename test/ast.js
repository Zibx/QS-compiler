/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 1/30/17.

module.exports = (function () {
    'use strict';
    var assert = require('chai').assert;
    var tokenizer = require('../Core/Tokenizer'),
        lexer = require('../Core/Preprocess');



    describe('AST', function() {

        it('function', function () {
            var data =
                'define UIComponent Slider\n'+
                '   .endEvt: (a, b)=>dwda=2;\n'+
                '       states.goto("state2");\n' +
                '       dadw\n';


            var ast = lexer(tokenizer(data, 'astFunctions.qs'));
            //console.log(ast[0].events.endEvt[0])
        })
    });
})();