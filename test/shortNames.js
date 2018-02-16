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

describe('define and use statics', function() {
    compile('test/qs/shortNames.qs', function (result) {

        console.log(result.js)
        var main = result.ast.main;

        it('should compile event fn', function(){
            console.log(main.events.t.trigger[0]._js.body)
            assert.equal(main.events.t.trigger[0]._js.body, 'var x = __private.get([\n    \'p\',\n    \'distance\'\n]) < 50 || __private.get([\n    \'s\',\n    \'value\'\n]) > 15;\n__private.get([\'prn\']).print();\n__private.set([\n    \'h\',\n    \'value\'\n], __private.get([\n    \'prn\',\n    \'template\'\n]));');
        });
        it('should compile pipe', function(){
            console.log(main.values.t.value._val)
            assert.equal(main.values.t.value._val, 'new Pipe(__private.ref(\'p.distance\'), __private.ref(\'s.value\'), function(p_distance,s_value){\n\treturn p_distance < 50 || s_value > 15 || p_distance > 20 || s_value < 30;\n})');
        });
    });
});
