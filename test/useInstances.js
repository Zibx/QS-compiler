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
    compile = common.compile, compact = common.compactFn,
    compactCode = common.compactCode;

describe('compile passing of constructor', function() {
    compile('test/qs/useInstances.qs', {newWay: true, sourceMap: false, ns: 'inline'}, function (result) {
        var main = result.ast.main;
        console.log(result.js);
        it('should require template var', function(){
            assert.include(result.js, '\tT,');
        });
        it('should pass constructor to ContainerComponent as a parameter', function(){
            assert.equal(main.values.c1.itemTemplate._val, 'T');
        });
        it('should require template full name', function(){

            assert.include(result.js, '"inline.T"');

        });
    });
});
