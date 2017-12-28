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
    var compactCode = function(code){
        return code.replace(/\s+/g,' ');
    };
    var collectEvents = function(item, path){
        var out = {};
        for(var i in item.events){
            var prop = item.events[i];
            if(!out[path])
                out[path] = {}
            prop.forEach(function(prop){

                (out[path][i] ||(
                    out[path][i] = []
                )).push(prop);

            });

        }
        return out;
    };
    var collect = function(item, path){
        var out = {};
        for(var i in item.values){
            var prop = item.values[i];
            if(!out[path])
                out[path] = {}
            if(prop instanceof build.Property){
                (out[path][i] || (out[path][i] = {}))._val = prop._val
            }else if(prop instanceof  build.InstanceMetadata){
                var sub = collect(prop, i);
                Object.assign(out[path], sub);
            }
        }
        return out;
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
            ns: fileName,
            source: source
        }, options), function(result){
            var i;


            for(var astName in result.ast){
                var out = {};
                var subAST = result.ast[astName];
                for( i in subAST.subItems ){
                    Object.assign( out, collect( subAST.subItems[i], i ) );
                }
                subAST.values = Object.assign(out, subAST.values);

                var out = {};
                var subAST = result.ast[astName];
                for( i in subAST.subItems ){
                    Object.assign( out, collectEvents( subAST.subItems[i], i ) );
                }
                out.___this___ = subAST.events;
                subAST.events = out;
            }



            cb(result)
        });
    };


    return {compile: compile, compact: compact, compactFn: function(code){
        return compact(code, true);
    }, compactCode: compactCode};

})();