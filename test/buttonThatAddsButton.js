/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 5/5/17.

    'use strict';
var assert = require('chai').assert;
var common = require('./toolchain/common'),
    compile = common.compile, compact = common.compactFn;

describe('call functions', function() {


    it('should compile fn call', function(cb){
        compile('test/qs/buttonThatAddsButton.qs', function (result) {
            console.log(result.js)
            var main = result.ast.main;

            assert.equal(
                result.js.match(/new Button\(\s*{\s*value:\s['\w]+\s*}\)/).length,
                1
            );
            cb()
        });
    });
});
