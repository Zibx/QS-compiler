/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 2/7/17.

module.exports = (function () {
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
        return f.substr(12, f.length - 14);
    };
    describe('Metadata', function() {

        it('extract', function (done) {
            var crafted = build({
                lib: void 0,
                source: fs.readFileSync('test/qs/functions.qs') + ''
            }, function(result){
                var change = result.ast.main.events.s1.change[0]._js;

                assert.equal(
                    compact(change),
                    'var x=5;__private.set(["s1","value"],x)'
                );

                assert.equal(
                    compact(result.ast.main.events.s1.change[1]._js),
                    'var x=5;(function(){__private.set(["s1","value"],x)}())'
                );

                done();
            });

        });
    });

})();