/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 5/5/17.

'use strict';
var assert = require('chai').assert;
var common = require('../../toolchain/common'),
    Path = require('path'),
    compile = common.compile, compact = common.compactFn;

describe('bug_set_subProps', function() {
    compile(Path.join(__dirname, 'bug_set_subProps.qs'), function (result) {
        var main = result.ast.main;
        it('should be privates', function(){
            console.log(result.js);

            assert.include(result.js, 'Symbol');
            assert.include(result.js
                .replace(/['"]/g,'\'')
                .replace(/[\n\s ]/g,''), '');
        });
    });
});
