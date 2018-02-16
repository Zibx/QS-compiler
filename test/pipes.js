/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2018
// By zibx on 2/13/18.

'use strict';
var assert = require('chai').assert;
var common = require('./toolchain/common'),
    compile = common.compile, compact = common.compactFn;

describe('Pipe setters', function() {
    compile('test/qs/pipes.qs', function (result) {
        var main = result.ast.A;
        console.log(result.js);
        it('should compile primiteve set', function(){
            console.log(main.values.time);
            assert.equal(result.js.replace(/\s/g,'').indexOf(`this.set("time", new Pipe(this.ref('time'), function(time){return time;`.replace(/\s/g,''))>0,true);
        });
    });
});
