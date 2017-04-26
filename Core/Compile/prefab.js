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
        SourceMap = require('source-map'),
        path = require('path');

    return {
        __compile: function(obj, compileCfg){
            var baseClassName = obj.extend[0];
            var source = [],
                i, ctor = [], props = [], cfg, inlines = [],

                ns,
                _self = this,
                sourceMap, sourcePath = obj.ast.name.pointer.source,
                itemsInfo = obj.itemsInfo = {};

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
            var fileInfo = path.parse(obj.ast.name.pointer.source);

            var nsName = this.getTag(obj, 'ns');
            ns = fileInfo.name+ (nsName?'.'+ nsName : '');

            /** REQUIRES */
            for(i in obj.require){
                if(this.world[i].namespace) {
                    var nsString = ['Q'].concat(this.world[i].namespace);
                    nsString.push(i);
                    source.push('var ' + i + ' = ' + nsString.join('.') + ';');
                }

            }

            source.push('var _AppNamespace = '+JSON.stringify(fileInfo.name)+';');
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
            ctor.push('var _self = this;');
            var privateDefined = false;

            for(var where in obj.instances){
                obj.instances[where].forEach(function (what) {
                    if(what.type === 'child') {
                        itemsInfo[what.name] = what;

                        //ctor.push('var ' + what.name + ' = new ' + what.class + '(); '+sm(what.ast.name || what.ast.class)+'var '+sm(what.ast.name || what.ast.class, what.name||what.class)+'DATA_'+what.name+''+(what.ast.semiToken?sm(what.ast.semiToken):'')+'='+what.name+'._data;');

                        var scope = what.ast.scope && what.ast.scope.data;
                        var isPublic = scope === 'public';
                        what.isPublic = isPublic;
                        if(isPublic) {
                            ctor.push('this.set(\'' + what.name + '\', new ' + what.class + '());')
                        } else {
                            if(!privateDefined){
                                ctor.push('var __private = new Q.Core.QObject();');
                                privateDefined = true;
                            }
                            ctor.push('__private.set(\'' + what.name + '\', new ' + what.class + '());')
                        }
                        console.log(isPublic, what);

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
                    var propValue = this.getPropertyValue(prop, obj, whos, sm);

                    if(!(propValue instanceof Error)) {
                        var scope = prop.item.scope && prop.item.scope.data;
                        var isPublic = scope === 'public' || whos === 'this';// && propName in obj.public);
                        if( isPublic ){

                            if(whos === 'this') {
                                ctor.push(
                                    'this.set(\'' + sm(prop.item.semiToken) + prop.name + '\', ' + propValue + sm(prop.item.semiToken) + ');');
                            }else{
                                if(prop.name === 'value' && ((prop.item.class && prop.item.class.data) in this._primitives)){
                                    ctor.push(
                                        'this.set(\'' + sm(prop.item.class) + whos + '\', ' + propValue + sm(prop.item.semiToken) + ');');
                                }else {
                                    ctor.push(
                                        'this.set(\'' + sm(prop.item.class) + whos + '.' + sm(prop.item.semiToken) + prop.name + '\', ' + propValue + sm(prop.item.semiToken) + ');');
                                }
                            }
                            
                        } else {
                            if (!privateDefined) {
                                ctor.push('var __private = new Q.Core.QObject();');
                            }
                            if(prop.name === 'value' && ((prop.item.class && prop.item.class.data) in this._primitives)){
                                ctor.push(
                                    '__private.set(\'' + sm(prop.item.class) + whos + '\', ' + propValue + sm(prop.item.semiToken) + ');');
                            }else {
                                ctor.push(
                                    '__private.set(\'' + sm(prop.item.class) + whos + (prop.name !== 'value' || true ? '.' + sm(prop.item.semiToken) + prop.name : '') + '\', ' + propValue + sm(prop.item.semiToken) + ');');
                            }
                            privateDefined = true;
                        }
                    }else{
                        throw propValue;
                    }
                }
            }

            for(var where in obj.instances) {
                obj.instances[where].forEach(function (what) {
                    if(what.type === 'child') {
                        var name = what.name,
                            info = itemsInfo[name],
                            fromQObject = _self.isInstanceOf(info.class, 'QObject'),
                            childGetter,
                            parent,
                            parentGetter;

                        if(fromQObject) {
                            if(what.isPublic){
                                childGetter = 'this.get(\''+ what.name +'\')';
                            }else{
                                childGetter = '__private.get(\''+ what.name +'\')';
                            }
                            if(where !== '___this___'){
                                parent = itemsInfo[where];
                                parentGetter = (parent.isPublic ? 'this' : '__private') +'.get(\''+ where +'\')';
                            }else{
                                parentGetter = 'this';
                            }

                            ctor.push(sm(what.ast.name || what.ast.class) + parentGetter + '.addChild(' + childGetter + ');');

                        }
                    }
                });
            }

            for(var who in obj.events) {
                for(var whatHappens in obj.events[who]) {
                    obj.events[who][whatHappens].forEach(function(evt){
                        var getter,
                            what = itemsInfo[who];
                        if(what.isPublic){
                            getter = 'this.get(\''+ what.name +'\')';
                        }else{
                            getter = '__private.get(\''+ what.name +'\')';
                        }

                        var whos = (who === '___this___' ? 'this' : who );
                        var propValue = _self.getPropertyValue(evt, obj, whos, sm);
                        if(!(propValue instanceof Error)) {
                            ctor.push(getter + '.on(\'' + whatHappens + '\', ' + propValue + ');');
                        }else{
                            console.log('Error getting event handler', evt);
                        }
                    });
                }
            }
            //obj.public
            
            ctor.push('}');
            for(i in obj.public){
                if(obj.name === obj.public[i].defined) {
                    props.push(i + ': {}');
                }
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
                moreDependencies = false,

                prop;

            if(item.type === 'DEFINE'){

                data = {
                    class: obj === cls ? item.name.data : item.class.data
                };
                if(!item.name){
                    item.name = {data: this.getUID(item.class.name || item.class.data)};
                }
                data.name = item.name.data;
                cls.variables[item.name.data] = data;

                items = obj.ast.items;
                for (i = 0, _i = items.length; i < _i; i++) {
                    item = items[i];


                    itemName = (item.class && item.class.data) || (item.name && item.name.data);
                    prop = this.callMethod('__isProperty', obj, itemName);
                    if (prop) {

                    } else if (itemName in this.world) {
                        this.addDependency(cls.name, item);
                    } else {
                        moreDependencies = true;
                        this.addDependency(cls.name, item.class);
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

                    prop = this.callMethod('__isProperty', obj, itemName);

                    if (prop) {

                        var value = {
                            type: 'property',
                            name: itemName,
                            item: item,
                            info: prop
                        };
                        internals.push(value);

                        if(!(objectName in cls.values))
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

                        if(item.private){
                            for(var propName in item.private){
                                cls.private[propName] = item.private[propName];
                            }
                        }
                        if(item.public){
                            for(var propName in item.public){
                                cls.public[propName] = item.public[propName];
                            }
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

            }
        }
    };
})();