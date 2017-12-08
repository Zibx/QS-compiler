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
    it('should throw unknown class when try to extend', function(done){
        //assert.throws(function(){
            compile('test/qs/errors/syntax1.qs', function (result) {
                done();
            });
        //}, /QQQQ/);
    });

    it('should suggest mistake in define word', function(done){

            compile('test/qs/errors/syntax2.qs', function (result) {
                assert.include(result.error,'main object is not specified');
                done();
            });

    });


    it('should throw unknown class when try to extend', function(done){

        compile('test/qs/errors/syntax3.qs', function (result) {
            assert.include(result.error, 'ha is not property of this');
            assert.include(result.error, 'lal is not property of this.from<Number>');
            assert.include(result.error, 'grr is not property of slider<Slider>');
            assert.include(result.error, 'd is not property of slider.value<Number>');
            assert.include(result.error, 'ui is not property of slider.from<Number>');
            assert.include(result.error, 'ololo is not property of this');
            done();
        });

    });
});
