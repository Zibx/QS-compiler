/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 7/14/17.


var assert = require('chai').assert;
var common = require('./toolchain/common'),
    compile = common.compile, compact = common.compact;

describe('CORE-118', function() {
    compile(`
def Page main
  ComboBox c1
    items: {nk1: "ololo",nk2: 5467}`, function (result) {
        var main = result.ast.main;
        it('should work as JSON', function(){

            assert.equal(main.values.c1.items._val, '{\n  "nk1": "ololo",\n  "nk2": 5467\n}')
        });
    });

  /*  compile(`
def Page main
  ComboBox c1: nk1
    items: 
        nk1: o lo lo
        nk2: 5467
        nk3:
            subNk4: 1
            subNk5: 2`, function (result) {
        var main = result.ast.main;
        it('should work with nested', function(){
            assert.equal(main.values.c1.items._val, '{\n  "nk1": "ololo",\n  "nk2": 5467\n}')
        });
    });

    compile(`
def Page main
  ComboBox c1
    items: 
        nk1: ololo
        nk2: 5467`, function (result) {
        var main = result.ast.main;
        it('should work with nested without quotes', function(){
            assert.equal(main.values.c1.items._val, '{\n  "nk1": "ololo",\n  "nk2": 5467\n}')
        });
    });*/
});
