/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 5/2/17.

module.exports = (function () {
    'use strict';
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
                var props = collector.props = [];
                for (var p in item.mixed.public) {
                    var prop = {};

                    var itemProp = item.mixed.public[p];
                    prop.name = p;
                    prop.type = itemProp.type;
                    if (i === itemProp.defined) { // own
                        props.push(prop);

                        info = item.mixed.ast.public[p];
                        var infoTag = getTag(info, 'info');

                        if (infoTag) {
                            prop.info = renderer(infoTag);
                        }
                    }
                    /*else{
                     console.log('\t',p, prop.type, prop.defined)
                     }*/
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
        return out;
    };
    if(module.parent){

    }else{
        doDoc();
    }
    return doDoc;
})();