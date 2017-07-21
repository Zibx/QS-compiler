/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 7/14/17.


var assert = require('chai').assert;
var build = require('../build'),
    esprima = require('esprima'),
    escodegen = require('escodegen'),
    fs = require('fs');
var compact = function(code){
    var f = escodegen.generate(esprima.parse('('+code+')'), {format: {
        renumber: true,
        hexadecimal: true,
        quotes: 'double',
        escapeless: true,
        compact: true,
        parentheses: false,
        semicolons: false
    }});
    var start = f.indexOf('{')+1;
    return f.substr(start, f.length - 2-start);
};
var compile = function(data, cb){
    var crafted = build({
        lib: 'test/lib/QComponent4/src',
        typeTable: 'Core/TypeTable.js',
        source: data + ''
    }, function(res){
        console.log(res.js)
        cb(res)
    });
};

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

    compile(`
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
    });
});
