/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 8/8/17.

var assert = require('chai').assert;
var common = require('./toolchain/common'),
    compile = common.compile, compact = common.compactFn;

describe('comments', function() {
    compile('test/qs/comments.qs', function (result) {
        var main = result.ast.main;
        var getter = function(num){
            return compact(main.events.b1.click[num]._js)
        };
        it('single line comment in ()->', function(){
            assert.equal(getter(0), 'var x=1');
        });
        it('single line comment in function()->', function(){
            assert.equal(getter(1), 'var x=1');
        });
        it('single line comment in function()->{}', function(){
            assert.equal(getter(2), 'var x=1');
        });
        it('single line comment in function(){}', function(){
            assert.equal(getter(3), 'var x=1');
        });
        it('single line comment in function(){if(){}else{comment}}', function(){
            assert.equal(getter(4), 'if(true){var x=1}else{}');
        });
        it('single line comment in function(){if(true){comment}else{var y=2}}', function(){
            assert.equal(getter(5), 'if(true){}else{var y=2}');
        });
        it('single line comment in function(){while(true){comment;var y=2}}', function(){
            assert.equal(getter(6), 'while(true){var y=2}');
        });
        it('single line comment in complex', function(){
            assert.equal(getter(7), '(function(){' +
                    'if(true){var z=3}while(true){var y=2}' +
                '}())');
        });
        it('single line comment in short', function(){
            assert.equal(getter(8), 'var x=10');
        });
        it('single line comment in short', function(){
            assert.equal(getter(9), 'var x=13');
        });
    });
});