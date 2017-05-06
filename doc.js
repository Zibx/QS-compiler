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
                out.text = tokenTools.toString(tag.children, [],void 0, {comments: true}).lines.join('\n')
            return out;
        });
    };
    var Compiler = require('./Core/Compile/Compiler');
    var compiler  = new Compiler({}),
        tokenTools = require('./Core/tokenTools');

    var world = compiler._world, item;
    var out = [];
    for(var i in world) {
        item = world[i];
        if (item.ast && !item.ast.js) {
            var collector = {};
            out.push(collector);
            collector.name = item.mixed.name;
            collector.namespace = item.mixed.namespace;

            var info = compiler.getTag(item.ast, 'info');
            if(info)
                collector.info = info;

            var examples = extractTags(item.ast, 'example');
            if(examples){
                collector.example = examples;
            }
            var props = collector.props = [];
            for(var p in item.mixed.public){
                var prop = {};

                var itemProp = item.mixed.public[p];
                prop.name = p;
                prop.type = itemProp.type;
                if(i === itemProp.defined) { // own
                    props.push(prop);

                    info = item.mixed.ast.public[p];
                    var infoTag = compiler.getTag(info, 'info');

                    if(infoTag){
                        prop.info = infoTag
                    }
                }/*else{
                    console.log('\t',p, prop.type, prop.defined)
                }*/
            }
            props.sort(function (a,b) {
                return a.name > b.name ? 1: -1;
            });

        }
    }
    out.forEach(function(o){
        if(o.name === 'Slider')
            console.log(JSON.stringify(o,null,2))
    });


})();