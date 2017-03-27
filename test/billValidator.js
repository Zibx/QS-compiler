/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 2/7/17.

module.exports = (function () {
    'use strict';
    var assert = require('chai').assert;
    var tokenizer = require('../Core/Tokenizer'),
        lexer = require('../Core/Preprocess'),
        Compiler = require('../Core/Compile/Compiler'),
        fs = require('fs');
    var fileName = 'billValidator';
    var mainComponent = 'ValidatorTestPage';
    describe('Compile '+ fileName, function() {

        it('extract', function () {
            var data = fs.readFileSync('test/qs/'+fileName+'.qs') + '',
                tokens = tokenizer(data, fileName+'.qs'),
                lex = lexer(tokens);

            var compiler  = new Compiler();

            lex.forEach(function(item){
                compiler.add(item);
                //item.metadata = metadata.extract(item);
            });

            //console.log(lex[0])
            var out = compiler.compile(mainComponent);
            console.log(out);
            fs.writeFileSync('test/generate/'+ fileName +'.js', out);

            //console.log(compiler.world.main)

            //console.log(JSON.stringify(compiler.world.main.require,null,2))
        });
    });

})();