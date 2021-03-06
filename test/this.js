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
    compile = common.compile, compactFn = common.compactFn,
    compact = common.compact;

describe('this', function() {
    compile('test/qs/this.qs', function (result) {
        var main = result.ast.main;

        it('should compile this++', function(){
            assert.equal(compactFn(main.events.Button_I1.click[0]._js), '__private.set(["Button_I1","value"],__private.get(["Button_I1","value"])+1)')
        });
        it('should compile this.value++', function(){
            assert.equal(compactFn(main.events.Button_I1.click[1]._js), '__private.set(["Button_I1","value"],__private.get(["Button_I1","value"])+1)')
        });

        it('should compile this++ in variants', function(){
            // OLD COMPILER:
            //assert.equal(compactFn(main.events.Variant_I2.click[0]._js), '__private.set(["Variant_I2"],__private.get(["Variant_I2"])+1)')

            assert.equal(compactFn(main.events.Variant_I2.click[0]._js), '__private.set(["Variant_I2","value"],__private.get(["Variant_I2","value"])+1)')
        });

        it('should compile this.value++ in variants', function(){
            assert.equal(compactFn(main.events.Variant_I2.click[1]._js), '__private.set(["Variant_I2","value"],__private.get(["Variant_I2","value"])+1)')
        });
        it('should compile this.someVal++ in variants', function(){
            assert.equal(compactFn(main.events.Variant_I2.click[2]._js), '__private.set(["Variant_I2","someVal"],__private.get(["Variant_I2","someVal"])+1)')
        });
        it('should compile implicit set of global title in Items event', function(){
            assert.equal(compactFn(main.events.Variant_I2.click[3]._js), '_self.set(["title"],_self.get(["title"])+"ttl")')
        });

        it('should compile this.enabled = false in timer', function(){
            assert.equal(compactFn(main.events.Timer_I3.tick[0]._js), '__private.set(["Timer_I3","enabled"],false)')
        });

        it('should compile set of this.title in main object event', function(){
            assert.equal(compactFn(main.events.___this___.onload[0]._js), '_self.set(["title"],_self.get(["title"])+"t3")')
        });

        it('should compile set of title in main object event', function(){
            assert.equal(compactFn(main.events.___this___.onload[1]._js), '_self.set(["title"],_self.get(["title"])+"t2")')
        });

        it('should compile set of scoped object value. s1<Slider> = 8', function(){
            assert.equal(compactFn(main.events.___this___.onload[2]._js), '__private.set(["s1","value"],8)')
        });

        it('should set property value to `this` default property value. s1<Slider>.from = s1.value', function(){
            assert.equal(compact(main.values.s1.from._val), 'new Pipe(__private.ref("s1.value"),function(s1_value){return s1_value})')
        });

        it('should compile main methods call in main object event', function(){
            assert.equal(compactFn(main.events.___this___.onload[3]._js), '_self.showKeyboard()');
        });

        it('should compile main methods call without `this` in main object event', function(){
            assert.equal(compactFn(main.events.___this___.onload[4]._js), '_self.showKeyboard()');
        });

        it('should compile this.value in pipe', function(){
            assert.equal(compact(main.values.s2.from._val),
                'new Pipe(__private.ref("s2.value"),function(s2_value){return s2_value})');
        });

        it('should compile this.value in pipe', function(){
            assert.equal(compact(main.values.l3.value._val),
                'new Pipe(__private.ref("s3.value"),function(s3_value){return s3_value})');
        });

        it('should compile value in function pipe', function(){
            assert.equal(compact(main.values.l4.value._val),
                'new Pipe(__private.ref("s3.value"),function(s3_value){return JSON(JSON(s3_value).l).h})');
        });
        it('value + value', function(){
            assert.equal(compact(main.values.l5.value._val),
                'new Pipe(__private.ref("s3.value"),function(s3_value){return s3_value+s3_value})');
        });
    });
});
