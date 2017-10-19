/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 8/8/17.

module.exports = (function () {
    'use strict';
    var build = require('../../build'),
        esprima = require('esprima'),
        escodegen = require('escodegen'),
        fs = require('fs');
    var compact = function(code, fn){
        var f = escodegen.generate(esprima.parse('('+code+')'), {format: {
            renumber: true,
            hexadecimal: true,
            quotes: 'double',
            escapeless: true,
            compact: true,
            parentheses: false,
            semicolons: false
        }});
        if(!fn)
            return f;
        var start = f.indexOf('{')+1;
        return f.substr(start, f.length - 2-start);
    };
    var compile = function(fileName, options, cb){
        if(typeof options === 'function') {
            cb = options;
            options = {};
        }
        try {
            var source = fs.readFileSync(fileName) + '';
        }catch(e){
            source = fileName;
        }
        var crafted = build(Object.assign({
            lib: 'test/lib/QComponent4/src',
            typeTable: 'Core/TypeTable.js',
            source: source
        }, options), cb);
    };
    return {compile: compile, compact: compact, compactFn: function(code){
        return compact(code, true);
    }};

})();