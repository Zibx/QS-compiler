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

describe('html primitives', function() {
    compile('test/qs/primitives.qs', function (result) {
        var main = result.ast.main;
        it('should compile fn call', function(){
            assert.equal(main.values.d0.value._val,'123');
            assert.equal(main.values.d1.value._val,'345');
            assert.equal(main.values.d2.value._val,'678');
        });
    });
});
