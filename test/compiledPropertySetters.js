/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 5/4/17.

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

    describe('Setters', function() {
        compile('test/qs/setters.qs', function (result) {
            var main = result.ast.main;
            it('number setters', function () {
                assert.equal(main.values.mySlider.from._val, '5');
                assert.equal(main.values.mySlider.to._val, '20');
                assert.equal(main.values.num.value._val, '10');
            });

            it('string setters', function () {
                assert.equal(main.values.combo1.value._val, '\'#000\'');
                assert.equal(main.values.combo1.label._val, '"Укажите цвет текста надписи \\"Изображение\\""');
            });

            console.log(result.js)
        });
    });

})();