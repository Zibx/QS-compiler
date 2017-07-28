/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 5/5/17.


    'use strict';
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
        return f;
        var start = f.indexOf('{')+1;
        return f.substr(start, f.length - 2-start);
    };
    var compile = function(fileName, cb){
        var crafted = build({
            lib: 'test/lib/QComponent4/src',
            typeTable: 'Core/TypeTable.js',
            source: fs.readFileSync(fileName) + ''
        }, cb);
    };

    describe('Arrays', function() {
        compile('test/qs/arrays.qs', function (result) {
            var main = result.ast.main;
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
