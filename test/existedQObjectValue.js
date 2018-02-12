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

describe('set existed QObject property in complex component', function() {
    compile('test/qs/existedQObjectValue.qs', function (result) {


        var main = result.ast.main;
        console.log(result.js)
        it('should set inline value', function(){
            assert.equal(main.values.d1.header.value._val, '"h1"');
        });
        it('should set not inlined value', function(){
            assert.equal(main.values.d2.header.value._val, '"h2"');
        });
    });
});
