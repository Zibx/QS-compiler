/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 2/7/17.


'use strict';
var assert = require('chai').assert;
var common = require('./toolchain/common'),
    compile = common.compile, compact = common.compactFn;

describe('JS transformations', function() {
    it('simple inner vars declaration', function (done) {
        compile('test/qs/functions.qs', function (result) {
            var change = result.ast.main.events.s1.change[0]._js;

            assert.equal(
                compact(change),
                'var x=5;__private.set(["s1","value"],x)'
            );
            done();
        });
    });

    it('compile refs in inner functions scopes', function (done) {
        compile('test/qs/functions.qs', function (result) {
            assert.equal(
                compact(result.ast.main.events.s1.change[1]._js),
                'var x=5;(function(){__private.set(["s1","value"],x)}())'
            );
            done();
        });
    });
    it('respect function args', function (done) {
        compile('test/qs/functions.qs', function (result) {
            assert.equal(
                compact(result.ast.main.events.s1.change[2]._js),
                'console.log(e)'
            );
            done();
        });
    });

    it('inner scope primitive values', function (done) {
        compile('test/qs/functions.qs', function (result) {
            assert.equal(
                compact(result.ast.main.events.s1.change[3]._js),
                '__private.set(["nInner"],__private.get(["s1","value"]));' +
                'console.log(__private.get(["nInner"]),__private.get(["nMain"]))'
            );
            done();
        });

    });

    it('comments', function (done) {
        compile('test/qs/functions.qs', function (result) {
            assert.equal(
                compact(result.ast.main.events.s1.change[4]._js),
                'if(true){var a}'
            );
            done();
        });

    });

    it('complicated quotes', function (done) {
        compile('test/qs/complicatedBraces.qs', function (result) {
            assert.equal(
                compact(result.ast.Property.events.b1.click[0]._js),
                'console.log(_self.get(["key"])+"=\\""+_self.get(["value"])+"\\"")'
            );
            done();
        });

    });

    it('public variables extraction in subscopes in event', function (done) {
        compile('test/qs/functions.qs', function (result) {
            assert.equal(
                compact(result.ast.Property.events.b1.click[1]._js),
                '_self.set(["key"],_self.get(["key"])+1);if(_self.get(["key"])){_self.get(["key"])}for(var i=0;i<1;i=i+1)_self.get(["key"]);if(_self.get(["key"]))_self.get(["key"]);for(var i=0;i<1;i=i+1){_self.get(["key"])?_self.get(["key"]):_self.get(["key"])}'
            );
            done();
        });
    });
    it('private variables extraction in subscopes in event', function (done) {
        compile('test/qs/functions.qs', function (result) {
            assert.equal(
                compact(result.ast.Property.events.b1.click[2]._js),
                '__private.set(["count"],__private.get(["count"])+1);if(__private.get(["count"])){__private.get(["count"])}for(var i=0;i<1;i=i+1)__private.get(["count"]);if(__private.get(["count"]))__private.get(["count"]);for(var i=0;i<1;i=i+1){__private.get(["count"])?__private.get(["count"]):__private.get(["count"])}'
            );
            done();
        });
    });
    it('private variables extraction in subscopes in private function', function (done) {
        compile('test/qs/functions.qs', function (result) {
            assert.equal(
                compact(result.ast.Property.private.f0.value._js),
                'var __private=this[_private],_self=this;this.on("~destroy",function(){__private["~destroy"]()});var f;__private.set(["count"],__private.get(["count"])+1);if(__private.get(["count"])){__private.get(["count"])}for(var i=0;i<1;i=i+1)__private.get(["count"]);if(__private.get(["count"]))__private.get(["count"]);for(var i=0;i<1;i=i+1){__private.get(["count"])?__private.get(["count"]):__private.get(["count"])}'
            );
            done();
        });
    });
    it('private variables extraction in subscopes in public function', function (done) {
        compile('test/qs/functions.qs', function (result) {
            assert.equal(
                compact(result.ast.Property.public.f1.value._js),
                'var __private=this[_private],_self=this;this.on("~destroy",function(){__private["~destroy"]()});var f;__private.set(["count"],__private.get(["count"])+1);if(__private.get(["count"])){__private.get(["count"])}for(var i=0;i<1;i=i+1)__private.get(["count"]);if(__private.get(["count"]))__private.get(["count"]);for(var i=0;i<1;i=i+1){__private.get(["count"])?__private.get(["count"]):__private.get(["count"])}'
            );
            done();
        });
    });
    it('public variables extraction in subscopes in public function', function (done) {
        compile('test/qs/functions.qs', function (result) {
            assert.equal(
                compact(result.ast.Property.public.f2.value._js),
                'var _self=this;var f;_self.set(["key"],_self.get(["key"])+1);if(_self.get(["key"])){_self.get(["key"])}for(var i=0;i<1;i=i+1)_self.get(["key"]);if(_self.get(["key"]))_self.get(["key"]);for(var i=0;i<1;i=i+1){_self.get(["key"])?_self.get(["key"]):_self.get(["key"])}'
            );
            done();
        });
    });
    it('public variables extraction in subscopes in private function', function (done) {
        compile('test/qs/functions.qs', function (result) {
            assert.equal(
                compact(result.ast.Property.private.f3.value._js),
                'var _self=this;var f;_self.set(["key"],_self.get(["key"])+1);if(_self.get(["key"])){_self.get(["key"])}for(var i=0;i<1;i=i+1)_self.get(["key"]);if(_self.get(["key"]))_self.get(["key"]);for(var i=0;i<1;i=i+1){_self.get(["key"])?_self.get(["key"]):_self.get(["key"])}'
            );
            done();
        });
    });
    it('compile mix of private/public unary operations in private fn', function (done) {
        compile('test/qs/functions.qs', function (result) {
            assert.equal(
                compact(result.ast.Property.private.f4.value._js),
                'var __private=this[_private],_self=this;this.on("~destroy",function(){__private["~destroy"]()});var f;f=f+_self.get(["key"]);f=f+__private.get(["count"]);f+=_self.get(["key"]);f+=__private.get(["count"]);f*=_self.get(["key"]);f*=__private.get(["count"]);f/=_self.get(["key"]);f/=__private.get(["count"]);f-=_self.get(["key"]);f-=__private.get(["count"]);f|=_self.get(["key"]);f|=__private.get(["count"]);f&=_self.get(["key"]);f&=__private.get(["count"]);f^=_self.get(["key"]);f^=__private.get(["count"]);f%=_self.get(["key"]);f%=__private.get(["count"])'
            );
            done();
        });
    });
    it('compile mix of private/public unary operations in public fn', function (done) {
        compile('test/qs/functions.qs', function (result) {
            assert.equal(
                compact(result.ast.Property.public.f5.value._js),
                'var __private=this[_private],_self=this;this.on("~destroy",function(){__private["~destroy"]()});var f;f=f+_self.get(["key"]);f=f+__private.get(["count"]);f+=_self.get(["key"]);f+=__private.get(["count"]);f*=_self.get(["key"]);f*=__private.get(["count"]);f/=_self.get(["key"]);f/=__private.get(["count"]);f-=_self.get(["key"]);f-=__private.get(["count"]);f|=_self.get(["key"]);f|=__private.get(["count"]);f&=_self.get(["key"]);f&=__private.get(["count"]);f^=_self.get(["key"]);f^=__private.get(["count"]);f%=_self.get(["key"]);f%=__private.get(["count"])'
            );
            done();
        });
    });
    it('compile mix of private/public unary add and binary add operations in all directions in public fn', function (done) {
        compile('test/qs/functions.qs', function (result) {
            console.log(result.js)
            assert.equal(
                compact(result.ast.Property.private.f6.value._js),
                'var __private=this[_private],_self=this;this.on("~destroy",function(){__private["~destroy"]()});var f;_self.set(["key"],f+_self.get(["key"]));_self.set(["key"],_self.get(["key"])+f);_self.set(["key"],f);_self.set(["key"],_self.get(["key"]));_self.set(["key"],__private.get(["count"]));_self.set(["key"],f+__private.get(["count"]));_self.set(["key"],__private.get(["count"])+f);_self.set(["key"],__private.get(["count"])+_self.get(["key"]));_self.set(["key"],_self.get(["key"])+__private.get(["count"]));_self.set(["key"],_self.get(["key"])+f);_self.set(["key"],_self.get(["key"])+_self.get(["key"]));__private.set(["count"],f+_self.get(["key"]));__private.set(["count"],_self.get(["key"])+f);__private.set(["count"],f);__private.set(["count"],_self.get(["key"]));__private.set(["count"],__private.get(["count"]));__private.set(["count"],f+__private.get(["count"]));__private.set(["count"],__private.get(["count"])+f);__private.set(["count"],__private.get(["count"])+_self.get(["key"]));__private.set(["count"],__private.get(["count"])+__private.get(["count"]));__private.set(["count"],__private.get(["count"])+f);__private.set(["count"],__private.get(["count"])+_self.get(["key"]))'
            );
            done();
        });
    });
});

