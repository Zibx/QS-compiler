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
    compile('test/qs/functionCalls.qs', function (result) {
        var main = result.ast.main;
        console.log(result.js)
        it('should compile fn call', function(){
            assert.equal(compact(main.events.b.click[0]._js), '__private.get(["t1"]).start()')
        });
    });
});
