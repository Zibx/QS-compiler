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
    compile = common.compile, compact = common.compact;

describe('Arrays', function() {
    compile('test/qs/arrays.qs', function (result) {
        var main = result.ast.main;
        console.log(result.js)
        it('respect their methods', function(){
            assert.equal(compact(main.values.ts.itemSource._val),
                'new Pipe(__private.ref("a.apps"),function(a_apps){return a_apps.slice(3)})');

        });
        it('respect arrays getting by index', function(){
            assert.equal(compact(main.values.ts2.itemSource._val),
                'new Pipe(__private.ref("a.apps"),function(a_apps){return a_apps[0]})');
        });
        it('respect arrays getting by indexes', function(){
            assert.equal(compact(main.values.ts3.itemSource._val),
                'new Pipe(__private.ref("a.apps"),function(a_apps){return[a_apps[0],a_apps[1]]})');
        });
    });
});
