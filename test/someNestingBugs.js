/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 12/6/17.

var assert = require('chai').assert;
var common = require('./toolchain/common'),
    compile = common.compile, compact = common.compactFn,
    compactCode = common.compactCode;

describe('nesting bug. unnamed prop in named', function() {
    compile('test/qs/someNestings.qs', {newWay: true, sourceMap: false}, function (result) {
        var main = result.ast.main;

        it('some nested struct should compile', function(){
            console.log(result.js)
            assert.include(result.js, 'new Header');
            assert.include(result.js, 'new VBox');
            assert.include(result.js, 'new FancyRB');
        });
    });
});
