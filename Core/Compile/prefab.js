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
    var InstanceMetadata = require('./InstanceMetadata');
    var Property = require('./Property');

    var console = new (require('../../console'))('Compile');
    var setRecursive = function(obj, vals){
        for(var key in vals){
            var val = vals[key],
                tokens = key.split('.'),
                pointer = obj,
                partName,
                last;
            if(!('value' in val.item))
                continue;

            for(var i = 0, _i = tokens.length-1; i < _i; i++){
                partName = tokens[i];
                if(!(partName in pointer))
                    pointer[partName] = {};
                pointer = pointer[partName];
            }
            partName = tokens[i];

            pointer[partName] = val.item.value;
        }
    };
    return {
        __compile: function(obj, compileCfg){
            var baseClassName = obj._extendList[0];
            var source = [],
                i, ctor = [], props = [], cfg, inlines = [],

                ns,
                _self = this,
                sourceMap, sourcePath = obj.ast.name.pointer.source,
                itemsInfo = obj.itemsInfo = {
                    this: {ast: obj.ast, class:obj._extendList[0], type:'def', isPublic: true}
                };

            if(compileCfg.sourceMap) {
                sourceMap = new SourceMap.SourceMapGenerator();
                var sm = function (ast, name) {
                    if(!ast)return '';
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
            }else{
                sm = function(){return '';};
            }
            var fileInfo = path.parse(obj.ast.name.pointer.source);

            var ns = obj.getTag('ns', true);
            /*if(compileCfg.ns){
                ns = compileCfg.ns;
            }else{
                var nsTokens = [];
                if(compileCfg.ns !== false)
                    nsTokens.push(fileInfo.name);

                if(nsName)
                    nsTokens.push(nsName);

                ns = nsTokens.join('.');
            }*/

            /** REQUIRES */
            var formRequires = function() {

                var source = [];
                var fullRequire = {}, j, requireInfo;
                for (i in obj.require) {
                    if (!(i in this.world)) {
                        throw new Error('Unknown class `' + i + '` ' + obj.require[i][0].pointer)
                    }
                    requireInfo = this.world[i];

                    if (this.world[i].namespace !== null) {
                        fullRequire[i] = this.world[i];
                    }

                    for (j in requireInfo.require) {
                        if (!(j in this.world)) {
                            throw new Error('Unknown class `' + j + '`, used in class `' + i + '`' + obj.require[i][0].pointer)
                        }
                        if (this.world[j].namespace !== null) {
                            fullRequire[j] = this.world[j];
                        }
                    }
                }


                var names = ['Core.Pipe'],
                    varNames = ['Pipe'];

                for (i in fullRequire) {
                    if (fullRequire[i]) {
                        names.push(fullRequire[i].namespace + '.' + i)
                        varNames.push(i);
                    }
                }
                source.push('var _AppNamespace = ' + JSON.stringify(ns || fileInfo.name) + ';');
                source.push((compileCfg.ns === false ? 'module.exports = ' : '') + 'QRequire(' + names.map(function (name) {
                        return JSON.stringify(name)
                    }).join(', ') + ', function(');

                source.push('\t' + varNames.join(',\t\n') + '\n){');
                source.push('"use strict";');

                return source;
            };
            //sm(obj.ast.definition)+ + sm(obj.ast.name, obj.name)
            /*source.push('var ' + obj.name +' = ' + baseClassName +
                //'.extend(\''+ sm(obj.ast.extend[0], ns) + ns +'\', '+sm(obj.ast.name, obj.name)+'\'' + obj.name+'\', {');
                '.extend(\''+ ns +'\', '+'\'' + obj.name+'\', {');
*/

            source.push('return ' + baseClassName +
                '.extend(\'' + ns + '\', \'' + obj.name + '\', {');



            //console.log('REQUIRES: '+requires.join('\n'));

            ctor.push('ctor: function(){');
            ctor.push('var _self = this;');
            var privateDefined = false;
            var checkDefinePrivates = function(){
                if(!privateDefined){
                    ctor.push('var __private = new Q.Core.QObject();');
                    privateDefined = true;
                }
            };

            var create = {};
            var created = {};
            for(var where in obj.instances) {
                obj.instances[where].forEach(function (what) {
                    if (what.type === 'child') {


                        itemsInfo[what.getName()] = what;
                        if(what.items && what.items.length){
                            what.items.forEach(function(item){

                                var info = item.info;
                                var tags = info && info.tags;
                                if(tags && tags.create){
                                    if(!(what.name in create)) {
                                        create[what.name] = [];
                                    }

                                    var createPropInfo = {
                                        prop: item.name,
                                        defined: obj.name,
                                        where: where
                                    };

//                                        created[item.name] = createPropInfo;
                                    create[what.name].push(createPropInfo);
                                }
                            });
                        }
                    }
                });
            }

            for(var where in obj.values) {
                if(where in create) {
                    var properties = obj.values[where];
                    var iInfo = itemsInfo[where];
                    var createProps = create[where];
                    createProps.forEach(function(propName){
                        var prop = properties[propName.prop];
                        var whos = (where === '___this___' ? 'this' : where );
                        var propValue = prop.item.value[0],
                            isPipe;
                        var type = prop.info.type,
                            createName = propValue.data ? propValue.data : propValue;


                        if(!(createName in created)) {


                            var item = {
                                name: createName,
                                class: type,
                                type: 'child',
                                ast: {}
                            };
                            obj.private[createName] = {type: type, defined: propName.defined};
                            obj.instances[propName.where].push(item);
                            itemsInfo[createName] = item;
                            created[createName] = item;
                        }
                    });

                }
            }

            var piped = [];
            var valuesCollector = {};
            for(var where in obj.values){
                var properties = obj.values[where];
                var iInfo = itemsInfo[where];
                var whos, whosMeta;
                if(where === '___this___'){
                    whos = 'this';
                    whosMeta = obj;
                }else{
                    whos = where;
                    whosMeta = obj.itemsInfo[whos];
                }
                var isPublic = obj.getPublic(where);

                for(var propName in properties){




                    var prop = properties[propName];
                    //if(prop.length === 1 && prop.getName() === propName){ // normal not nested property
                    var isPipe;
                    var propValue = prop.getValue();
                    var propValue =this.getPropertyValue(prop, obj, whosMeta, sm);
                    if(propValue !== void 0) {
                        if(typeof propValue.indexOf !== 'function'){
                            console.log(propValue)
                        }else
                            isPipe = propValue.indexOf('new Pipe') === 0;
                    }else{
                        this.getPropertyValue(prop, obj, whosMeta, sm)
                    }
                    if(!(propValue instanceof Error)) {
                        prop._val = propValue;

                        var isPublic = obj.getPublic(where) || whos === 'this' || iInfo.isPublic;// && propName in obj.public);

                        if(!valuesCollector[whos])
                            valuesCollector[whos] = {};

                        if( isPublic ){

                            if(whos === 'this') {
                                if(isPipe) {
                                    piped.push(
                                        'this.set(\'' + sm(prop.item.semiToken) + prop.name + '\', ' + propValue + sm(prop.item.semiToken) + ');');
                                }else{
                                    valuesCollector['this'][prop.name] = propValue;
                                }
                            }else{
                                if(prop.name === 'value' && ((prop.item.class && prop.item.class.data) in this._primitives)){
                                    if(!isPipe) {
                                        valuesCollector[whos].value = propValue;// + sm(prop.item.semiToken);
                                    }else {
                                        piped.push(
                                            'this.set(\'' + sm(prop.item.class) + whos + '\', ' + propValue + sm(prop.item.semiToken) + ');');
                                    }
                                }else {
                                    if(!isPipe) {
                                        valuesCollector[whos][prop.name] = propValue;
                                    }else {
                                        piped.push(
                                            'this.set(\'' + sm(prop.item.class) + whos + '.' + sm(prop.item.semiToken) + prop.name + '\', ' + propValue + sm(prop.item.semiToken) + ');');
                                    }
                                }
                            }

                        } else {
                            checkDefinePrivates();
                            if(prop.name === 'value' && ((prop.item.class && prop.item.class.data) in this._primitives)){
                                if(!isPipe) {
                                    valuesCollector[whos].value = propValue;
                                } else {
                                    piped.push(
                                        '__private.set(\'' + sm(prop.item.class) + whos + '\', ' + propValue + sm(prop.item.semiToken) + ');');
                                }
                            }else {
                                if(!isPipe) {
                                    valuesCollector[whos][prop.name] = propValue;
                                }else {
                                    piped.push(
                                        '__private.set(\'' + sm(prop.ast.class) + whos + (prop.name !== 'value' || true ? '.' + sm(prop.ast.semiToken) + prop.name : '') + '\', ' + propValue + sm(prop.ast.semiToken) + ');');
                                }
                            }
                        }
                    }else{
                        throw propValue;
                    }

                    //}


                    /*
                    var propValue = this.getPropertyValue(prop, obj, whos, sm),
                        isPipe;

                    if(propValue !== void 0) {
                        if(typeof propValue.indexOf !== 'function'){
                            console.log(propValue)
                        }else
                            isPipe = propValue.indexOf('new Pipe') === 0;
                    }else{
                        this.getPropertyValue(prop, obj, whos, sm)
                    }
                    if(!(propValue instanceof Error)) {
                        prop._val = propValue;
                        var scope = prop.item.scope && prop.item.scope.data;
                        var isPublic = scope === 'public' || whos === 'this' || iInfo.isPublic;// && propName in obj.public);

                        if(!valuesCollector[whos])
                            valuesCollector[whos] = {};

                        if( isPublic ){

                            if(whos === 'this') {
                                if(isPipe) {
                                    piped.push(
                                        'this.set(\'' + sm(prop.item.semiToken) + prop.name + '\', ' + propValue + sm(prop.item.semiToken) + ');');
                                }else{
                                    valuesCollector['this'][prop.name] = propValue;
                                }
                            }else{
                                if(prop.name === 'value' && ((prop.item.class && prop.item.class.data) in this._primitives)){
                                    if(!isPipe) {
                                        valuesCollector[whos].value = propValue;// + sm(prop.item.semiToken);
                                    }else {
                                        piped.push(
                                            'this.set(\'' + sm(prop.item.class) + whos + '\', ' + propValue + sm(prop.item.semiToken) + ');');
                                    }
                                }else {
                                    if(!isPipe) {
                                        valuesCollector[whos][prop.name] = propValue;
                                    }else {
                                        piped.push(
                                            'this.set(\'' + sm(prop.item.class) + whos + '.' + sm(prop.item.semiToken) + prop.name + '\', ' + propValue + sm(prop.item.semiToken) + ');');
                                    }
                                }
                            }

                        } else {
                            checkDefinePrivates();
                            if(prop.name === 'value' && ((prop.item.class && prop.item.class.data) in this._primitives)){
                                if(!isPipe) {
                                    valuesCollector[whos].value = propValue;
                                } else {
                                    piped.push(
                                        '__private.set(\'' + sm(prop.item.class) + whos + '\', ' + propValue + sm(prop.item.semiToken) + ');');
                                }
                            }else {
                                if(!isPipe) {
                                    valuesCollector[whos][prop.name] = propValue;
                                }else {
                                    piped.push(
                                        '__private.set(\'' + sm(prop.item.class) + whos + (prop.name !== 'value' || true ? '.' + sm(prop.item.semiToken) + prop.name : '') + '\', ' + propValue + sm(prop.item.semiToken) + ');');
                                }
                            }
                        }
                    }else{
                        throw propValue;
                    }*/
                }
            }

                        //ctor.push('var ' + what.name + ' = new ' + what.class + '(); '+sm(what.ast.name || what.ast.class)+'var '+sm(what.ast.name || what.ast.class, what.name||what.class)+'DATA_'+what.name+''+(what.ast.semiToken?sm(what.ast.semiToken):'')+'='+what.name+'._data;');
            for(var where in obj.instances) {
                obj.instances[where].forEach(function (what) {
                    if (what.type === 'child') {
                        var isPublic = obj.getPublic(what);
                        what.isPublic = isPublic;
                        var vals = valuesCollector[what.name],
                            data = [],
                            stringData;
                        for( i in vals){
                            data.push( '\t'+JSON.stringify(i) + ':'+ vals[i] );
                        }
                        data.push('\t"#": '+JSON.stringify(what.name));
                        if(data.length) {
                            stringData = '{\n' + data.join(',\n') + '}';
                        }else{
                            stringData = '';
                        }
                        //debugger;
                        _self.tryCall(what.class, '__instantiate', [vals, data, stringData], function(err, result){
                            if(!err)
                                stringData = result;
                            else
                                stringData = 'new ' + what.class.getName() + '('+ stringData +')';
                        });

                        if(isPublic) {
                            ctor.push('this.set(\'' + what.getName() + '\', '+ stringData +');')
                        } else {
                            checkDefinePrivates();

                            ctor.push('__private.set(\'' + what.getName() + '\', '+ stringData +');')
                        }
                        //console.log(isPublic, what);

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
                            '){'+ what.value.body.data +'}');
                    }
                });

            }
            if(valuesCollector['this']){
                var vals = valuesCollector['this'],
                    data = [],
                    stringData;
                for( i in vals){
                    data.push( '\t'+JSON.stringify(i) + ':'+ vals[i] );
                }
                if(data.length) {
                    stringData = '{\n' + data.join(',\n') + '}';
                }else{
                    stringData = '';
                }
                ctor.push('this.setAll('+ stringData +');');
            }

            ctor = ctor.concat(piped);



            for(var where in obj.instances) {
                obj.instances[where].forEach(function (what) {
                    if(what.type === 'child') {

                        var name = what.name,
                            info = itemsInfo[name],
                            fromQObject = _self.isInstanceOf(info.class, 'QObject'),
                            childGetter,
                            parent,
                            parentGetter;
                        console.log(info.class +' is '+(fromQObject?'':'not ')+'instance of QObject ');
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
                        if(who === '___this___') {
                            getter = 'this';
                        }else if(what.isPublic){
                            getter = 'this.get(\''+ what.name +'\')';
                        }else{
                            getter = '__private.get(\''+ what.name +'\')';
                        }

                        var whos = (who === '___this___' ? 'this' : who );
                        var propValue = _self.getPropertyValue(evt, obj, whos, sm);
                        evt._js = propValue;
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
                var _i = i;
                if(i === 'value') {
                    props.push('value: "__value__"');
                    i = '__value__';
                }
                if(obj.name === obj.public[_i].defined) {
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
            if(compileCfg.newWay) {
                source.push('});');
            }

            obj._extendList.forEach(function(name){
                _self.tryCall(name, '__afterCompile', [source, obj.name], function(err, result){
                    if(!err)
                        source = result;
                });
            });

            var code = formRequires.call(this).join('\n')+'\n'+source.join('\n'),
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
                    var ast = esprima.parse(ccode, {range: true, tokens: true, comment: true,
                        tolerant: true});
                } catch (e) {
                    //debugger;
                    console.log('ESPRIMA', ccode, e)
                }

                ast = escodegen.attachComments(ast, ast.comments, ast.tokens);
                var source = escodegen.generate(ast, {comment: true});
            }else{
                source = ccode;
            }
            if(cfg.sourceMap) {
                var map = sourceMap.toString();
            }
            var result = {source: source, map: map};
            console.log(result)
            return result;
        },
        __isProperty: function (cls, prop) {
            var info = this.world[cls.class ? cls.class || cls.class.data : cls.name],
                propInfo;
            if(!info)
                return false;

            propInfo = info.public[prop] || info.private[prop];

            if(this.getTag(info, 'anything'))
                return {_type: 'Variant'};

            if(propInfo)
                return propInfo;

            // TODO recursive go up

            return false;
            //debugger;
        },
        /*
        @arg obj: inspecting object
        @arg cls: class of defining object
        @arg path:Array path to inspecting object

         */
        __dig: function(obj, cls, path) {
            var ast = obj.ast,
                data, oldItemName, i, _i, items,
                moreDependencies = false,
                prop, anything;

            path = path || [];

            if(ast.type === 'DEFINE'){
                items = obj.ast.items;

                for (i = 0, _i = items.length; i < _i; i++) {

                    anything = false;

                    var item = items[i];
                    if(item.class)
                        var itemClassName = item.class.data;

                    if(item.name)
                        var itemName = item.name.data;

                    var propInMeta;
                    var searchingFor = itemClassName || itemName;
                    /* we can define:
                     Label: without name.
                     Label with: name
                     existed: prop

                     so we check that class dependency is satisfied.*/

                    // maybe we have property with that name
                    propInMeta = obj.findProperty(searchingFor);
                    if(obj instanceof InstanceMetadata){
                        anything = obj.class.getTag('anything');
                    }
                    if(!propInMeta && !anything){
                        this.addDependency(cls.getName(), searchingFor);
                        if(!(searchingFor in this.world)){
                            moreDependencies = true;
                        }
                    }
                }

                /*
                 1) create named with not piped properties or inline pipes to properties that are already defined
                 2) create unnamed with inline pipes
                 3) create other pipes
                 4) add items as children
                 */

                if (!obj.getName()){
                    obj.setName(this.getUID(obj.class.getName()));
                    obj.noName = true;
                }

                if (moreDependencies) {
                    console.log('More deps for `' + obj.name.getValue() + '` <'+obj._extendList[0]+'> in `' + cls.name.getValue() + '`: ' + this.wait[cls.name.getValue()].join(', '));
                    obj.findProperty(searchingFor)
                    return false;
                }

                // now deps are loaded


                var objectName = obj.name;
                if(obj === cls) {
                    objectName = '___this___';

                    for (var eventName in obj.ast.events) {
                        obj.ast.events[eventName].forEach(function (event) {
                            cls.addEvent(objectName, event.name.data, event); // was event.value
                        });
                    }
                }

                items = obj.ast.items;
                for (i = 0, _i = items.length; i < _i; i++) {
                    item = items[i];
                    if(item.class)
                        var itemClassName = item.class.data;

                    if(item.name)
                        var itemName = item.name.data;

                    var propInMeta;
                    var searchingFor = itemClassName || itemName;
                    propInMeta = obj.findProperty(searchingFor);

                    //var itemPath = path.slice(1).concat(searchingFor);

                    if (propInMeta) {
                        // is property
                        var val;
                        cls.addValue(objectName, searchingFor+'.value', val = new Property({
                            name: path.concat('value'),
                            ast: item, //was item
                            class: propInMeta.class,
                            value: item.value
                        }));
                        //cls.addItem(objectName, val); // join path?

                        var childObjectName = objectName;
                        if(item.cls && item.cls.length){
                            cls.addValue(childObjectName, searchingFor+'.cls', val = new Property({
                                class: this.world.String,
                                name: path.concat('cls'),
                                ast: Object.assign(Object.create(item),{value: item.cls}), //was item
                                //info: item.findProperty('cls'),
                                value: item.cls.value
                            }));
                            //cls.addItem(objectName, val); // join path?
                        }

/*
//////// GADOST
                        var valueDataType = this.world[item.class.getValue()].getPublic('value').class;
                        if(!valueDataType){
                            console.warn(item.class.getValue() + ' has no value property, but you try to set it to '+ item.value[0])
                            valueDataType = this.world.Variant;
                        }
                        //.class;
                        var value = new Property({
                            class: valueDataType,
                            ast: item,
                            name: path.concat('value'),
                            value: item.value
                        });
//////// GADOST
*/

                        var childItem = new Property({
                            class: propInMeta.class,
                            ast: item,
                            name: path,
                            value: item.value
                        });

                        this.callMethod('__dig', childItem.class, cls, path.concat(searchingFor));
                        /*var fakes = fake.values[searchingFor];
                        if(prop.type === 'Variant' && fakes){
                            var currentVal = cls.values[childObjectName][searchingFor];
                            setRecursive(childItem.values, fakes);
                            var inText = JSON.stringify(childItem.values);
                            value.item.value = {
                                data: inText,
                                type: 'DEEP'
                            };

                        }else if(fakes) {

                            for (var x in fakes) {
                                fakes[x].name = searchingFor+'.'+fakes[x].name;
                                cls.values[childObjectName][searchingFor + '.' + x] = fakes[x];
                                var j = fake;
                            }
                        }*/

                    }else if (searchingFor in this.world) { // is not known property. class name?

                        var childItem = new InstanceMetadata({
                            class: this.world[searchingFor],
                            ast: item,
                            isPublic: item.isPublic
                        });

                        if(childItem.class.getName() === 'Function'){
                            childItem.type = 'inline';
                        }

                        if (!childItem.getName()){
                            childItem.setName(this.getUID(childItem.class.getName()));
                            childItem.noName = true;
                        }

                        if(this.callMethod('__dig', childItem, cls) === false){
                            return false;
                        }

                        cls.addItem(objectName, childItem); // join path?

                        if(item.value && item.value.length){

                            var childObjectName = childItem.name;

                            if(!(childObjectName in cls.values))
                                cls.values[childObjectName] = {};

                            prop = this.callMethod('__isProperty', childItem, 'value');
                            //TODO Property!

                            var valueDataType = this.world[item.class.getValue()].getPublic('value').class;
                            if(!valueDataType){
                                console.warn(item.class.getValue() + ' has no value property, but you try to set it to '+ item.value[0])
                                valueDataType = this.world.Variant;
                            }
                            //.class;
                            var value = new Property({
                                class: valueDataType,
                                ast: item,
                                name: path.concat('value'),
                                value: item.value
                            });
                            cls.addValue(childObjectName, 'value', value);

                        }else if(item.value){
                            childItem.value = item.value;
                        }

                        if(item.cls && item.cls.length){
                            var childObjectName = childItem.name;

                            if(!(childObjectName in cls.values))
                                cls.values[childObjectName] = {};

                            cls.addValue(childObjectName, searchingFor+'.cls', val = new Property({
                                class: this.world.String,
                                name: path.concat('cls'),
                                ast: Object.assign(Object.create(item),{value: item.cls}), //was item
                                value: item.cls.value
                            }));
                        }

                        //if(item.isPublic)
/*
                        for(var propName in item.private){
                            cls.private[propName] = item.private[propName];
                        }
                        for(var propName in item.public){
                            cls.public[propName] = item.public[propName];
                        }

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


                        }*/



                    }


                }
                //obj.items = internals;

            }
        }
    };
})();
