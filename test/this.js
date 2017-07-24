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

    describe('this', function() {
        compile('test/qs/this.qs', function (result) {
            var main = result.ast.main;
            it('should compile this++', function(){
                assert.equal(compact(main.events.Button_I1.click[0]._js), '__private.set(["Button_I1","value"],__private.get(["Button_I1","value"])+1)')
            });
            it('should compile this.value++', function(){
                assert.equal(compact(main.events.Button_I1.click[1]._js), '__private.set(["Button_I1","value"],__private.get(["Button_I1","value"])+1)')
            });

            it('should compile this++ in variants', function(){
                assert.equal(compact(main.events.Variant_I3.click[0]._js), '__private.set(["Variant_I3"],__private.get(["Variant_I3"])+1)')
            });

            it('should compile this.value++ in variants', function(){
                assert.equal(compact(main.events.Variant_I3.click[1]._js), '__private.set(["Variant_I3","value"],__private.get(["Variant_I3","value"])+1)')
            });
            it('should compile this.someVal++ in variants', function(){
                assert.equal(compact(main.events.Variant_I3.click[2]._js), '__private.set(["Variant_I3","someVal"],__private.get(["Variant_I3","someVal"])+1)')
            });
            it('should compile this.enabled = false in timer', function(){
                assert.equal(compact(main.events.Timer_I5.tick[0]._js), '__private.set(["Timer_I5","enabled"],false)')
            });

            it('should compile this.title in main object event', function(){
                assert.equal(compact(main.events.___this___.onload[0]._js), '_self.set(["title"],"t3")')
            });

            it('should compile title in main object event', function(){
                assert.equal(compact(main.events.___this___.onload[1]._js), '_self.set(["title"],"t2")')
            });

            it('should compile title in main object event', function(){
                assert.equal(compact(main.events.___this___.onload[2]._js), '__private.set(["s1","value"],8)')
            });

            it('should compile main methods call in main object event', function(){
                assert.equal(compact(main.events.___this___.onload[3]._js), '_self.showNext()');
            });

            it('should compile main methods call in main object event', function(){
                assert.equal(compact(main.events.___this___.onload[4]._js), '_self.showNext()');
            });

        });
    });
