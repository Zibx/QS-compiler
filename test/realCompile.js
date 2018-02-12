/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 2/7/17.

'use strict';
var assert = require('chai').assert;
var common = require('./toolchain/common'),
    compile = common.compile, compact = common.compactFn;
    fs = require('fs');

describe('Compile', function() {

    it('extract', function () {
        var data = fs.readFileSync('test/qs/AbstractComponent.qs') + '';


        compile(data, {main: 'AbstractComponent'},function(res){
            //var out = compiler.compile('AbstractComponent', {sourceMap: true});
            console.log(res.js);
            fs.writeFileSync('test/generate/AbstractComponent.js', res.js);
        })

        //console.log(lex[0])

        //console.log(compiler.world.main)

        //console.log(JSON.stringify(compiler.world.main.require,null,2))
    });
});
