/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 2/7/17.

'use strict';
var assert = require('chai').assert;
var tokenizer = require('../Core/Tokenizer'),
    lexer = require('../Core/Preprocess'),
    Compiler = require('../Core/Compile/Compiler'),
    fs = require('fs');
var fileName = 'billValidator';
var mainComponent = 'ValidatorTestPage';
var build = require('../build');
var common = require('./toolchain/common'),
    compile = common.compile, compact = common.compact;
describe('Compile '+ fileName, function() {

    compile('test/qs/'+fileName+'.qs', function(result){


        it('extract', function () {

            fs.writeFileSync('test/generate/'+ fileName +'.js', result.js);

            //console.log(compiler.world.main)

            //console.log(JSON.stringify(compiler.world.main.require,null,2))
        });
    })
});

