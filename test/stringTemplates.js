/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 5/4/17.

'use strict';
var assert = require('chai').assert;
var common = require('./toolchain/common'),
compile = common.compile, compact = common.compact;

describe('string templates', function() {
    compile('test/qs/stringTemplates.qs', function (result) {
        console.log(result.js)
        var main = result.ast.main;

        it('use in js', function () {
            assert.include(result.js.replace(/\s*/g, ''), "console.log(`testit${__private.get(['s0','value'])}`);");
        });
        it('use in qs values', function () {
            console.log(result.ast.main.values.s)
            assert.include(result.ast.main.values.s.value._val.replace(/\s*/g, ''), "`testit${s0_value>30?30:`${s0_value}`}`");
        });

    });
});

