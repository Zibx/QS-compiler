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

describe('new Button and Slider', function() {


    it('should compile adding of new Button and Slider', function(cb){
        compile('test/qs/buttonThatAddsButtonAndSlider.qs', function (result) {
            console.log(result.js)
            var main = result.ast.main;

            assert.match(
                result.js, /new\s*Button\s*\(\s*{\s*['"\s]*value['"\s]*:\s*["'\w]+\s*}\s*\)/
            );
            assert.match(
                result.js, /new\s*Slider\s*\(\s*{\s*/
            );

            assert.include(result.js, 'UI.Controls.Button');
            assert.include(result.js, 'UI.Controls.Slider');

            cb()
        });
    });
});
