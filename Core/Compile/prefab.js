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

    //var console = new (require('../../console'))('Compile');
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
                        throw new Error('Unknown class `' + i + '` ');// + obj.require[i][0].pointer)
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
                '.extend(\'' + ns + '\', \'' + obj.getName() + '\', {');



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

            /*var create = {};
            var created = {};
            for(var where in obj.instances) {
                obj.instances[where].forEach(function (what) {
                    if (what.type === 'child') {


                        itemsInfo[what.getName()] = what;
                        if(what.items && what.items.length){
                            what.items.forEach(function(item){

                                var info = item.info;

                                if(info.getTag('create')){
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
                            var childItem = new InstanceMetadata({
                                class: this.world[type],
                                ast: item,
                                isPublic: item.isPublic
                            });
                            childItem.setName(createName);
                            obj.addPrivate(createName, childItem);//{type: type, defined: propName.defined});
                            obj.instances[propName.where].push(item);
                            itemsInfo[createName] = item;
                            created[createName] = item;
                        }
                    });

                }
            }*/

            var piped = [];
            var eventSubs = [];
            var valuesCollector = {};
            /*for(var where in obj.values){
                var properties = obj.values[where];
                var iInfo = obj.subItems[where];
                var whos, whosMeta;
                if(where === '___this___'){
                    whos = 'this';
                    whosMeta = obj;
                }else{
                    whos = where;
                    whosMeta = obj.subItems[whos];
                }
                var isPublic = obj.getPublic(where);

                for(var propName in properties){




                    var prop = properties[propName];
                    //if(prop.length === 1 && prop.getName() === propName){ // normal not nested property
                    var isPipe;
                    //var propValue = prop.getValue();
                    var propValue = this.getPropertyValue(prop, obj, whosMeta, sm);
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


                    /!*
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
                    }*!/
                }
            }*/

                        //ctor.push('var ' + what.name + ' = new ' + what.class + '(); '+sm(what.ast.name || what.ast.class)+'var '+sm(what.ast.name || what.ast.class, what.name||what.class)+'DATA_'+what.name+''+(what.ast.semiToken?sm(what.ast.semiToken):'')+'='+what.name+'._data;');

            for(var where in obj.instances) {
                obj.instances[where].forEach(function (what) {
                    if (what.type === 'child') {
                        var gathererCtx = {
                            piped: piped, mainCls: obj, sm: sm, base: what, eventSubs: eventSubs
                        };
                        ctor.push(_self.callMethod('valueGatherer', what, gathererCtx))
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


            var appendList = [];
            for(var where in obj.instances) {
                obj.instances[where].forEach(function (what) {
                    if(what.type === 'child') {

                        var name = what.name,
                            info = obj.subItems[name],
                            fromQObject = _self.isInstanceOf(info.class.getName(), 'QObject'),
                            childGetter,
                            parent,
                            parentGetter;
                        console.log(info.class.getName() +' is '+(fromQObject?'':'not ')+'instance of QObject ');
                        if(fromQObject) {
                            if(what.isPublic){
                                childGetter = 'this.get(\''+ what.name +'\')';
                            }else{
                                childGetter = '__private.get(\''+ what.name +'\')';
                            }
                            if(where !== '___this___'){
                                parent = obj.subItems[where];
                                parentGetter = (parent.isPublic ? 'this' : '__private') +'.get(\''+ where +'\')';
                            }else{
                                parentGetter = 'this';
                            }

                            appendList.push(sm(what.ast.name || what.ast.class) + parentGetter + '.addChild(' + childGetter + ');');

                        }
                    }
                });
            }

            ctor = ctor.concat(eventSubs);
            for(var evtName in obj.events) {
                //for(var whatHappens in obj.events[who]) {
                    obj.events[evtName].forEach(function(evt){
                        var getter = 'this';//,
                            //what = obj.subItems[who];
                        //if(who === '___this___') {
                            //getter = 'this';
                        /*}else if(what.isPublic){
                            getter = 'this.get(\''+ what.name +'\')';
                        }else{
                            getter = '__private.get(\''+ what.name +'\')';
                        }*/

                        //var whos = (who === '___this___' ? 'this' : who );
                        var propValue = _self.getPropertyValue(evt, obj, obj, sm);
                        evt._js = propValue;

                        if(!(propValue instanceof Error)) {
                            ctor.push(getter + '.on(\'' + evtName + '\', ' + propValue + ');');
                        }else{
                            console.log('Error getting event handler', evt);
                        }
                    });
                //}
            }
            //obj.public

            ctor = ctor.concat(appendList);

            ctor.push('}');
            for(i in obj.public){
                if(i === 'value') {
                    props.push('value: "__value__"');
                }else{

                    props.push( i + ': {}' );
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
        valueGatherer: function(obj, ctx, path){
            var piped = ctx.piped,
                eventSubs = ctx.eventSubs;
            var propName, values = obj.values, prop;
            var data = [],
                vals = {}, i, _i,
                isPublic,
                stringData, isPipe,
                sm = ctx.sm;
            if(!path)
                path = [obj.getName()];

            for(propName in values){
                prop = values[propName];

                if(prop instanceof Property){

                    var resultString;

                    var propValue = prop.getValue();
                    var propValue = this.getPropertyValue(prop, ctx.mainCls, obj, sm);

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
                        isPublic = ctx.base.isPublic;
                        if(!isPipe) {
                            vals[propName] = propValue;// + sm(prop.item.semiToken);
                        }else {
                            var pipePath = path.concat(propName);

                            piped.push(
                                (isPublic?'this': '__private')+'.set(' +
                                sm(prop.ast.class) +
                                    JSON.stringify(pipePath.join('.')) + ', ' +
                                    propValue +
                                sm(prop.ast.semiToken) + ')');

                        }
                    }else{
                        throw propValue;
                    }

                }else if(prop instanceof InstanceMetadata){
                    vals[propName] = this.callMethod('valueGatherer', prop, ctx, path.concat(propName))
                }
            }

            for(var evtName in obj.events){
                var events = obj.events[evtName];
                for(i = 0, _i = events.length; i < _i; i++){
                    var evt = events[i];
                    var propValue = this.getPropertyValue(evt, ctx.mainCls, obj, sm);
                    evt._js = propValue;

                    eventSubs.push((isPublic?'this': '__private')+'.get(' +
                        JSON.stringify(path) + ').on('+ JSON.stringify(evtName) +','+
                            propValue +
                        + ')');
                }
            }

            var _padLeft = new Array(path.length+2).join('\t'),
                _smallPadLeft = new Array(path.length+1).join('\t'),
                _tinyPadLeft = path.length > 1 ? '' : '\t';

            for( i in vals){
                data.push( _padLeft+ JSON.stringify(i) + ': '+ vals[i] );
            }
            data.push( _padLeft+ '"#": '+JSON.stringify(path.join('.')));



            if(data.length) {
                stringData = '{\n' + data.join(',\n') + '\n'+_smallPadLeft+'}';
            }else{
                stringData = '';
            }

            this.tryCall(obj.class, '__instantiate', [vals, data, stringData], function(err, result){
                if(!err)
                    stringData = result;
                else
                    stringData = 'new ' + obj.class.getName() + '('+ stringData +')';
            });

            isPublic = obj.isPublic;

            if(isPublic) {
                return (_tinyPadLeft+ 'this.set(\'' + obj.getName() + '\', '+ stringData +')')
            } else {
                //checkDefinePrivates();

                return (_tinyPadLeft+ '__private.set(\'' + obj.getName() + '\', '+ stringData +')')
            }

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
        }
    };
})();
