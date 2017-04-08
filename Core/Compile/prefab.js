/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 3/6/17.

module.exports = (function () {
    'use strict';
    var esprima = require('esprima'),
        escodegen = require('escodegen'),
        SourceMap = require('source-map');

    return {
        __compile: function(obj, compileCfg){
            var baseClassName = obj.extend[0];
            var source = [],
                i, ctor = [], props = [], cfg, inlines = [],

                ns,
                _self = this,
                sourceMap, sourcePath = obj.ast.name.pointer.source;

            if(compileCfg.sourceMap) {
                sourceMap = new SourceMap.SourceMapGenerator();
                var sm = function (ast, name) {
                    if(!ast)return;
                    name = name || '';
                    var pos;
                    if(ast.pointer)
                        pos = [ast.pointer.row, ast.pointer.col,name && new Buffer(name).toString('base64')];
                    else if(ast.loc)
                        pos = [ast.loc.start.line,ast.loc.start.column,name && new Buffer(name).toString('base64')];
                    else
                        return '';
                    return '/*%$@'+ pos +'@$%*/';
                }
            }

            ns = this.getTag(obj, 'ns') || 'App'+ baseClassName;

            /** REQUIRES */
            for(i in obj.require){
                if(this.world[i].namespace) {
                    var nsString = ['Q'].concat(this.world[i].namespace);
                    nsString.push(i);
                    source.push('var ' + i + ' = ' + nsString.join('.') + ';');
                }

            }
            source.push('var Pipe = Q.Core.Pipe;');
            //sm(obj.ast.definition)+ + sm(obj.ast.name, obj.name)
            /*source.push('var ' + obj.name +' = ' + baseClassName +
                //'.extend(\''+ sm(obj.ast.extend[0], ns) + ns +'\', '+sm(obj.ast.name, obj.name)+'\'' + obj.name+'\', {');
                '.extend(\''+ ns +'\', '+'\'' + obj.name+'\', {');
*/
            source.push('var '+ sm(obj.ast.name,obj.name) + obj.name +' = '+ baseClassName +
                '.extend(\''+ ns +'\', \''+obj.name+'\', {');



            //console.log('REQUIRES: '+requires.join('\n'));

            ctor.push('ctor: function(){');

            for(var where in obj.instances){
                obj.instances[where].forEach(function (what) {
                    if(what.type === 'child') {
                        ctor.push('var ' + what.name + ' = new ' + what.class + '(); '+sm(what.ast.name || what.ast.class)+'var '+sm(what.ast.name || what.ast.class, what.name||what.class)+'DATA_'+what.name+''+(what.ast.semiToken?sm(what.ast.semiToken):'')+'='+what.name+'._data;');
                    }else if(what.type === 'inline'){
                        var trailingComment = [], tag;
                        if(what.ast.tags &&
                            (tag = what.ast.tags.description || what.ast.tags.info)){
                            trailingComment.push(_self.extractFirstTag(tag),'');
                        }

                        what.value.arguments.forEach(function(item){
                            trailingComment.push('@param {'+item.type+'} '+item.name);
                        });
                        trailingComment.push('@returns {'+what.value.returnType+'}');
                        inlines.push(
                            (trailingComment.length > 0 ? '\n/**\n\t * '+trailingComment.join('\n\t * ')+'\n\t */': '')+
                            what.name +': function('+
                            what.value.arguments.map(function(item){
                                return item.name;
                            })
                                .join(', ')+
                            '){'+what.value.body.data+'}');
                    }
                });

            }

            for(var where in obj.values){
                var properties = obj.values[where];
                for(var propName in properties){
                    var prop = properties[propName];
                    var whos = (where === '___this___' ? 'this' : where );
                    ctor.push(
                        sm(prop.item.class)+ whos + '.'+ sm(prop.item.semiToken) +'set(\'' + prop.name + '\', '+ this.getPropertyValue(prop, obj, whos,sm)+sm(prop.item.semiToken)+');');
                }
            }

            for(var where in obj.instances) {
                obj.instances[where].forEach(function (what) {
                    if(what.type === 'child') {
                        ctor.push(sm(what.ast.name||what.ast.class)+(where === '___this___' ? 'this' : where ) + '.addChild(' + what.name + ');');
                    }
                });
            }

            var _self = this;
            for(var who in obj.events) {
                for(var whatHappens in obj.events[who]) {
                    obj.events[who][whatHappens].forEach(function(evt){
                        var whos = (who === '___this___' ? 'this' : who );
                        ctor.push(whos + '.on(\'' + whatHappens + '\', '+_self.getPropertyValue(evt, obj, whos,sm)+');');
                    });
                }
            }
            //obj.public
            
            ctor.push('}');
            for(i in obj.public){
                props.push(i+': {}')
            }
            ctor = ctor.join('\n');
            props = '_prop: {\n'+ props.join(',\n') +'\n}\n';

//console.log('/////', inlines)
            inlines.push(ctor);
            cfg = [inlines.join(','), props];

            source.push(cfg.join(','));



            source.push('});');


            obj.extend.forEach(function(name){
                var info = _self.world[name],
                    after = info && info.ast && _self.getTag(info.ast, '__afterCompile');
                if(after){
                    after = new Function('', 'return '+after)();
                    after && (source = after.call(this, source, obj.name));
                }

            });

            var code = source.join('\n'),
                rowDecrements = {};
            var ccode = code.replace(/\/\*%\$@([0-9]*,[0-9]*,[^@]*)@\$%\*\//g, function(a,b,c){
                var poses = b.split(','),
                    rows = (code.substr(0,c)).split('\n'),
                    line = rows.length,
                    row = rows[line-1],
                    column = row.length-(rowDecrements[rows.length]|0)+1,
                    map = {
                        source: sourcePath,
                        original: {line: poses[0], column: poses[1]-1},
                        generated: {line:line, column: column-1}
                    };
                if(poses[2]) {
                    map.name = new Buffer(poses[2], 'base64').toString();
                    //map.name = poses[2]
                }
                // console.log(map.name +' '+map.original.line+':'+map.original.column+' -> '+map.generated.line+':'+map.generated.column)
                rowDecrements[rows.length] = (rowDecrements[rows.length]|0) + a.length;
                sourceMap.addMapping(map);
                // console.log()
                return '';
            });

            if(compileCfg.beautify) {
                console.log(sourceMap.toString());
                try {
                    var ast = esprima.parse(ccode, {range: true, tokens: true, comment: true});
                } catch (e) {
                    //debugger;
                    console.log('ESPRIMA', ccode, e)
                }

                ast = escodegen.attachComments(ast, ast.comments, ast.tokens);
                var source = escodegen.generate(ast, {comment: true});
            }else{
                source = ccode;
            }
            var map = sourceMap.toString();
            var result = {source: source, map: map};
            return result;
        },
        __isProperty: function (cls, prop) {
            var info = this.world[cls.class ? cls.class || cls.class.data : cls.name],
                propInfo;
            if(!info)
                return false;

            propInfo = info.public[prop] || info.private[prop];
            if(propInfo)
                return propInfo;

            // TODO recursive go up

            return false;
            //debugger;
        },
        __dig: function(obj, cls) {
            var item = obj.ast,
                data, itemName, i, _i, items,
                moreDependencies = false;

            if(item.type === 'DEFINE'){

                data = {
                    class: obj === cls ? item.name.data : item.class.data
                };
                if(!item.name){
                    item.name = {data: this.getUID(item.class.name)};
                }
                data.name = item.name.data;
                cls.variables[item.name.data] = data;

                items = obj.ast.items;
                for (i = 0, _i = items.length; i < _i; i++) {
                    item = items[i];


                    itemName = (item.class && item.class.data) || (item.name && item.name.data);
                    var prop = this.callMethod('__isProperty', obj, itemName);
                    if (prop) {

                    } else if (itemName in this.world) {
                        //console.log(cls.name, '<', itemName)
                        this.addDependency(cls.name, item);
                    } else {
                        moreDependencies = true;
                        //this.addDependency(obj.class, item.class);
                        this.addDependency(cls.name, item.class);
                        //this.addDependency(cls.class, obj.class);
                    }
                    //obj.values[itemName] = item.value;
                }
                /*
                 1) create named with not piped properties or inline pipes to properties that are already defined
                 2) create unnamed with inline pipes
                 3) create other pipes
                 4) add items as children
                 */

                if (moreDependencies) {
                    console.log('More deps for `' + obj.name + '` <'+obj.class+'> in `' + cls.name + '`: ' + this.wait[cls.name].join(', '))
                    return false;
                }

                var internals = [];
                var objectName = obj.name;
                if(obj === cls) {
                    objectName = '___this___';
                }


                for (i = 0, _i = items.length; i < _i; i++) {
                    item = items[i];
                    itemName = (item.class && item.class.data) || (item.name && item.name.data);

                    var prop = this.callMethod('__isProperty', obj, itemName);

                    if (prop) {

                        var value = {
                            type: 'property',
                            name: itemName,
                            item: item,
                            info: prop
                        };
                        internals.push(value);

                        if(!(obj.name in cls.values))
                            cls.values[objectName] = {};

                        cls.values[objectName][itemName] = value;

                    }else if (itemName in this.world) {
                        //console.log(itemName, item.name)
                        var childItem = {
                            type: 'child',
                            class: item.class.data,
                            ast: item,
                            name: itemName,
                            values: {}
                        };
                        if(childItem.class === 'Function'){
                            childItem.type = 'inline';
                        }
                        if (item.name){
                            childItem.name = item.name.data;
                        }else{
                            childItem.name = this.getUID(childItem.class);
                        }
                        if(this.callMethod('__dig', childItem, cls) === false){
                            return false;
                        }

                        internals.push(childItem);

                        if(!('instances' in cls))
                            cls.instances = {};

                        (cls.instances[objectName] = cls.instances[objectName] || []).push(childItem);

                        if(item.value && item.value.length){

                            var childObjectName = childItem.name;

                            if(!(childObjectName in cls.values))
                                cls.values[childObjectName] = {};

                            prop = this.callMethod('__isProperty', item, 'value');

                            var value = {
                                type: 'property',
                                name: 'value',
                                item: item,
                                info: prop
                            };


                            cls.values[childObjectName].value = value;
                        }else if(item.value){
                            childItem.value = item.value;
                        }

                        if(item.events){

                            for(var eventName in item.events){

                                item.events[eventName].forEach(function (event) {

                                    if(!('events' in cls)){
                                        cls.events = {};
                                    }
                                    if(!(childItem.name in cls.events))
                                        cls.events[childItem.name] = {};

                                    var name = event.name.data;

                                    (cls.events[childItem.name][name] ||
                                    (cls.events[childItem.name][name] = []))
                                        .push(event.value);

                                });


                            }

                        }


                    }


                }
                obj.items = internals;

            }else{
                //debugger
            }

        }
    };
})();