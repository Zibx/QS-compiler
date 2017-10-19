/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 10/18/17.

'use strict';
var assert = require('chai').assert;
var common = require('./toolchain/common'),
    compile = common.compile, compact = common.compactFn;

describe('compile radio buttons', function() {
    compile('test/qs/radio.qs', {newWay: true}, function (result) {
        var main = result.ast.main;
        console.log(result.js)
        /*it('should compile fn call', function(){
            assert.equal(main.values.l1.value._val, 'function(a){\nreturn a > 2;\n}')
        });*/
    });
});
