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

describe('setting functions as property', function() {
    compile('test/qs/functionAssigments.qs', function (result) {

        console.log(result.js)
        var main = result.ast.main;
        it('should compile private fn call', function(){
            assert.match(main.events.b1.click[0]._js,
                /function\s*\(\)\{\s*__private\.add\['call'\]\(_self\);\s\}/);
        });
        it('should compile public fn call', function(){
            assert.match(main.events.b3.click[0]._js,
                /function\s*\(\)\{\s*_self\.addPublic\(\);\s\}/);
        });
    });
});
