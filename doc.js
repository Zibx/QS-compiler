/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 5/2/17.

module.exports = (function () {
    'use strict';
    var Fs = require('fs'),
        Path = require('path')
    function readDirRecursive(path, base) {
        if(!base)
            base = '';

        var entries = Fs.readdirSync(path);
        var ret = [];
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            var fullPath = Path.join(path, entry);
            var stat = Fs.statSync(fullPath);
            if (stat.isFile()) {
                /*if (entry == "TypeTable.js")
                 ret.push("module.exports.TypeTable=require('../" + fullPath.replace(/\\/g, "/") + "')");
                 else*/
                ret.push(Path.join(base,entry).replace(/\\/g, "/"));
            }
            if (stat.isDirectory()) {

                if(entry[0] !== '.') // SYSTEM
                    ret = ret.concat(readDirRecursive(fullPath, base?Path.join(base, entry):entry));
            }
        }
        return ret;
    };
    var extractTags = function(obj, name){
        if(!obj.tags || !obj.tags[name])
            return false;
        var items = obj.tags[name], vals;
        if(!items || !items.length)
            return false;

        return items.map(function(tag){
            var out = {info: tag.value.map(function(item){return item.data;}).join('')};

            if(tag.children)
                out.text = (
                    drawChildrenData(
                        tokenTools.toString(
                            tag.children, [],void 0, {comments: true}
                        )
                    )
                );
            return out;
        });
    };
    var Compiler = require('./Core/Compile/Compiler');
    var marked = require('marked');
    var tokenTools = require('./Core/tokenTools');
    var renderer = function(text){
        return marked(text);
    };
    var argumentsParser = function(args){
        return args.map(function(arg){
            var info = arg.info;
            delete arg.info;
            var stack = [];
            for(var i = 0, _i = info.length; i < _i; i++){
                var char = info[i];
                if(char === '[' || char === '(' || char === '{' || char === '<') {
                    stack.push(char);
                }
                if(char === ']' || char === ')' || char === '}' || char === '>') {
                    stack.length && stack.pop();
                }
                if(stack.length === 0 && (char === ' ' || char === '\t')){
                    break;
                }
            }
            return {
                type: info.substr(0, i),
                name: info.substr(i+1),
                info: marked(arg.text)
            };
        });
    };
    marked.setOptions({
        highlight: function (code, lang) {
            return ('<div style="overflow: visible; position: relative; width: 95%; height: 100%; font-size: 14px;" class="Q-UI-LiveQS">' +
            '<div class="LiveQSCode" style="font-family: monospace;">'+
                code +
            '</div>' +
            '<div style="clear: both;"></div></div>');
        },
        code: function(code){
            return code;
        }
    });
    var drawChildrenData = function(childrenData){
        var minLength = childrenData.lines.filter(function(line){
            return line.length>0;
        }).map(function (line) {
            return line.replace(/^(\s*)(.*)/,'$1').length;
        }).reduce(function (a, b) {
            // TODO check for single line case
            return a<b?a:b;
        });
        var spaces = new RegExp('^'+new Array(minLength+1).join(' '));
        return childrenData.lines.map(function(line){
            return line.replace(spaces, '');
        }).join('\n');
    };
    var getTag = function(ast, tagName){
        var out = compiler.getTag(ast, tagName),
            childrenData;
        if(out === false)
            return false;
        var children = ast.tags[tagName][0].children;
        if(children) {
            childrenData = tokenTools.toString(ast.tags[tagName][0].children, [],void 0, {comments: true});


            out += '\n'+drawChildrenData(childrenData)
        }
        return out;
    };
    var compiler;
    var doDoc = function () {


        compiler = new Compiler({});

        var world = compiler._world, item;
        var out = [];
        for (var i in world) {
            item = world[i];
            if (item.ast && !item.ast.js) {
                var collector = {};
                out.push(collector);
                collector.name = item.mixed.name;
                collector.namespace = item.mixed.namespace;

                var info = getTag(item.ast, 'info');
                if (info) {
                    collector.info = renderer(info);//.replace(/\n/g,'<br>');
                }

                var examples = extractTags(item.ast, 'example');
                if (examples) {
                    collector.example = examples;
                }
                var props = collector.props = [],
                    events = collector.events = [],
                    fns = collector.fns = [];
                for (var p in item.mixed.public) {
                    var prop = {};

                    var itemProp = item.mixed.public[p];
                    prop.name = p;
                    prop.type = itemProp.type;

                    var own = prop.own = i === itemProp.defined;

                    var ast = own ? item.mixed.ast.public[p] : world[ itemProp.defined ].mixed.ast.public[p];

                    info = item.mixed.ast.public[p];
                    var infoTag = getTag(ast, 'info');

                    if (infoTag) {
                        prop.info = renderer(infoTag);
                    }

                    if(prop.type === 'Event'){
                        var args = extractTags(ast, 'arg');

                        prop.args = argumentsParser(args);
                        events.push(prop);
                    }else if(prop.type === 'Function'){
                        fns.push(prop);
                    }else{
                        props.push(prop);
                    }




                }
                props.sort(function (a, b) {
                    return a.name > b.name ? 1 : -1;
                });

            }
        }
        /*out.forEach(function (o) {
            if (o.name === 'Slider')
                console.log(JSON.stringify(o, null, 2))
        });*/

        var docs = readDirRecursive('Core/Docs');
        console.log(docs)

        return out;
    };
    if(module.parent){

    }else{
        doDoc();
    }
    return doDoc;
})();