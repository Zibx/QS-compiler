/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 11/23/17.

'use strict';
var assert = require('chai').assert;
var common = require('./toolchain/common'),
    compile = common.compile, compact = common.compactFn;

describe('Error messages', function() {


    it('should throw unknown class when try to extend', function(){
        //assert.throws(function(){
            compile('test/qs/errors/syntax1.qs', function (result) {});
        //}, /QQQQ/);
    });

    it('should throw unknown class when try to extend', function(){

            compile('test/qs/errors/syntax2.qs', function (result) {});
        assert.throws(function(){}, /QQQQ/);
    });
});
