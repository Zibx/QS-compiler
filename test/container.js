/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 12/7/17.

'use strict';
var assert = require('chai').assert;
var common = require('./toolchain/common'),
    compile = common.compile, compact = common.compact;

describe('Insert items into containers', function() {
    compile('test/qs/container.qs', function (result) {
        var main = result.ast.main;
        console.log(result.js)
        it('should insert elements into header', function(){
            assert.include(result.js,
            "this.get('header').addChild(__private.get('b1'));");

        });

    });
});
