/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 12/28/17.


var assert = require('chai').assert;
var common = require('./toolchain/common'),
    compile = common.compile, compact = common.compactFn;

describe('transformation bug fix', function() {
    compile('test/qs/bugInTransform.qs', function (result) {
        var main = result.ast.main;
        console.log(result.js)
        it('should functions with new Arrays', function(){
            assert.equal(compact(main.events.s1.change[0]._js), '__private.get(["t1"]).start()')
        });
    });
});

