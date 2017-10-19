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
    compile('test/qs/nested.qs', {newWay: true, sourceMap: false}, function (result) {
        var main = result.ast.main;
        console.log(result.js);
        /*it('should create template and pass it\'s constructor to ContainerComponent', function(){
            assert.equal(main.values.c1.itemTemplate._val, 'T');
            assert.equal(result.js.indexOf('"inline.T"')>0, true);
            assert.equal(result.js.indexOf('T,')>0, true);
        });*/
    });
});
