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
    var ShouldNotBeSetted = function(obj){
        this.obj = obj;
    };

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
                privateInlines = [],
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

            /** REQUIRES */
            var formRequires = function() {

                var source = [];
                var fullRequire = {}, j, requireInfo;
                for (i in obj.require) {
                    if (!(i in this.world)) {
                        obj.require[i][0].pointer.error('Unresolved required dependency ' + i + ' ');
                        return [];
                        //throw new Error('Unknown class `' + i + '` ');// + obj.require[i][0].pointer)
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

                source.push('\t' + varNames.join(',\n\t') + '\n){');
                source.push('"use strict";');


                if(obj.privatesFlag){
                    source.push('\tvar _private = Symbol(),\n' +
                        '\t\t_privateConstructor = QObject' +
                        (privateInlines.length === 0 ? ';' :
                        '.extend(\'' + ns + '\', \'_' + obj.getName() + '\', {\n\t' +
                        privateInlines.join(',\n\t')+
                        '\n});'));
                }

                return source;
            };


            source.push('return ' + baseClassName +
                '.extend(\'' + ns + '\', \'' + obj.getName() + '\', {');



            //console.log('REQUIRES: '+requires.join('\n'));

            ctor.push('ctor: function(){');
            ctor.push('%PRIVATEVARS%');
            var privateDefined = false;
            var checkDefinePrivates = function(){
                if(!privateDefined){
                    ctor.push('var __private = new Q.Core.QObject();');
                    privateDefined = true;
                }
            };

            var piped = [];
            var eventSubs = [];
            var valuesCollector = {};
            var create = [];


            var valueGatherer = function (what) {
                if (what.type === 'child') {
                    var gathererCtx = {
                        piped: piped, mainCls: obj, sm: sm, base: what, eventSubs: eventSubs, create: create, valueGatherer: valueGatherer
                    };
                    var res = _self.callMethod('valueGatherer', what, gathererCtx);
                    if(typeof res === 'string'){
                        ctor.push( res );
                    }
                }else if(what.type === 'inline'){
                    var trailingComment = [], tag;
                    if(what.ast.tags &&
                        (tag = what.ast.tags.description || what.ast.tags.info)){
                        trailingComment.push(_self.extractFirstTag(tag),'');
                    }
                    if(what.value){
                        if( what.value.arguments ){
                            what.value.arguments.forEach( function( item ){
                                trailingComment.push( '@param {' + item.type + '} ' + item.name );
                            } );
                        }
                        trailingComment.push( '@returns {' + what.value.returnType + '}' );

                        var functionBody = _self.getPropertyValue( what, obj, (where === '___this___' ? obj : what), sm );
                        if( functionBody.body ){
                            if( functionBody.body.indexOf( '__private' ) > -1 ){ // not good. TODO: go to ast
                                privateDefined = true;
                                functionBody.body = 'var __private = this[_private], _self = this;\n' + functionBody.body;
                            }else{
                                functionBody.body = 'var _self = this;\n' + functionBody.body;
                            }
                        }else{
                            debugger
                        }
                        what.value._js = functionBody.toString();

                        (what.isPublic ? inlines : privateInlines).push(
                            (trailingComment.length > 0 ? '\n\t/**\n\t * ' + trailingComment.join( '\n\t * ' ) + '\n\t */\n' : '') +
                            what.name + ': ' + functionBody.toString()


                            /* function('+
                            what.value.arguments.map(function(item){
                                    return item.name;
                                })
                                .join(', ')+
                            '){'+ functionBody +'}'*/ );
                    }


                }
            };

            var parts = {gathered: [], precreate: []}, tmpCtor = ctor;
            ctor = parts.gathered;
            for(var where in obj.instances) {
                obj.instances[where].forEach(valueGatherer);
            }


            valueGatherer(Object.assign(Object.create(obj),{type: 'child', propsOnly: true, existed: true, isMain: true, isPublic: true}));


            obj.state = 'inlineCreate';
            ctor = parts.precreate;
            create.forEach(valueGatherer);
            ctor = tmpCtor.concat(parts.precreate).concat(parts.gathered);


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

                        var name = what.getName(),
                            info = obj.subItems[name],
                            fromQObject = _self.isInstanceOf(info.class.getName(), 'QObject'),
                            childGetter,
                            parent,
                            parentGetter;
                        console.log(info.getName() +' <'+info.class.getName() +'> is '+(fromQObject?'':'not ')+'instance of QObject ');
                        if(fromQObject) {
                            if(what.isPublic){
                                childGetter = 'this.get(\''+ what.name +'\')';
                            }else{
                                childGetter = '__private.get(\''+ what.name +'\')';
                            }
                            if(where !== '___this___'){
                                var whereParts = where.split('.');

                                parent = obj.subItems[whereParts[0]];
                                if(!parent){

                                    var propInObj = obj.findProperty(whereParts[0]);
                                    if(propInObj){
                                        parent = propInObj;
                                    }
                                }
                                if(!parent){
                                    what.ast.class.pointer.error('Try to append '+ name +' to unknown '+ where);
                                    /*try to continue with less damage*/
                                    return null;
                                    /*debugger
                                    throw new Error('Try to append '+ name +' to unknown '+ where);*/
                                }else{
                                    parentGetter = (parent.isPublic ? 'this' : '__private') +'.get(\''+ where +'\')';
                                }

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
            var privateVars = ['var _self = this;'];
            //console.log('privatesFlag', obj.privatesFlag)
            if(obj.privatesFlag){

                privateVars.push('var __private = this[_private] = new _privateConstructor();');
                this.addDependency(obj, 'QObject');
            }

            ctor = ctor.join('\n').replace('%PRIVATEVARS%', privateVars.join('\n')+'\n');
            props = '_prop: {\n'+ props.join(',\n') +'\n}\n';

//console.log('/////', inlines)
            inlines.push(ctor);
            cfg = [inlines.join(','), props];

            source.push(cfg.join(','));



            source.push('});');

            source.push('});');


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
            //console.log(result)
            return result;
        },
        valueGatherer: function(obj, ctx, path, deep){
            if(obj.inlineCreate && ctx.mainCls.state !== 'inlineCreate')
                return;
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
            var _padLeft = new Array(path.length+2).join('\t'),
                _smallPadLeft = new Array(path.length+1).join('\t'),
                _tinyPadLeft = path.length > 1 ? '' : '\t';

            for(propName in values){
                prop = values[propName];


                // get information about property from class where it is defined
                var propInObject = obj.findProperty(propName);

                if(propInObject){
                    if( propInObject.getTag( 'create' ) ){
                        if(prop instanceof Property){
                            propValue = prop.getValue();
                        }else{
                            propValue = prop.getValue('value');// values.value.getValue();
                        }
                        if(propValue && propValue.length && propValue[0] && propValue[0].data){
                            var propValueRaw = propValue[0].data;


                            //propValue = prop.values.value this.getPropertyValue(prop.values.value, ctx.mainCls, obj, sm);


                            if( !ctx.mainCls.findProperty( propValueRaw ) ){
                                var createClsName = propInObject.class.getName();
                                this.addDependency(ctx.mainCls, createClsName)
                                var instance = new InstanceMetadata({
                                    class: this.world[createClsName],
                                    ast: prop.ast,
                                    isPublic: false,
                                    //value: item.value,
                                    name: propValueRaw,
                                    values: prop.values,
                                    inlineCreate: true
                                });

                                if(prop.values && prop.values.value) {
                                    delete prop.values.value;
                                }

                                ctx.mainCls.addItem( '___this___', instance );
                                ctx.create.push(instance);


                            }
                            prop = new Property( {
                                name: [propName],
                                ast: prop.ast,
                                class: obj.findProperty( propName ),
                                value: propValue
                            } );
                        }else{
                            console.log('no value in property that is marked as creating inline')
                        }
                    }
                }

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
                            if(!isPublic){
                                ctx.mainCls.privatesFlag = true;
                            }
                            piped.push(_tinyPadLeft +
                                (isPublic?'this': '__private')+'.set(' +
                                sm(prop.ast.class) +
                                    JSON.stringify(pipePath.join('.')) + ', ' +
                                    propValue +
                                sm(prop.ast.semiToken) + ')');

                        }
                    }else{
                        throw propValue;
                    }

                }else if(prop instanceof InstanceMetadata && !obj.propsOnly){
                    var gatheredResult = this.callMethod( 'valueGatherer', prop, ctx, path.concat( propName ), true );
                    if(gatheredResult instanceof ShouldNotBeSetted){

                    }else{
                        vals[propName] = gatheredResult;
                    }
                }

            }
            if(!obj.propsOnly){
                for( var evtName in obj.events ){
                    var events = obj.events[evtName];
                    for( i = 0, _i = events.length; i < _i; i++ ){
                        var evt = events[i];
                        var propValue = this.getPropertyValue( evt, ctx.mainCls, obj, sm );
                        evt._js = propValue;

                        eventSubs.push( _tinyPadLeft +(isPublic ? '_self' : '__private') + '.get(' +
                            JSON.stringify( path ) + ').on(' + JSON.stringify( evtName ) + ', ' +
                            propValue +
                            ')' );
                    }
                }
            }


            for( i in vals){
                data.push( _padLeft+ JSON.stringify(i) + ': '+ vals[i] );
            }
            !deep && data.push( _padLeft+ '"#": '+JSON.stringify(path.join('.')));



            if(data.length) {
                stringData = '{\n' + data.join(',\n') + '\n'+_smallPadLeft+'}';
            }else{
                stringData = '';
            }


            if(!obj.existed){
                this.tryCall( obj.class, '__instantiate', [vals, data, stringData], function( err, result ){
                    if( !err )
                        stringData = result;
                    else
                        stringData = 'new ' + obj.class.getName() + '(' + stringData + ')';
                } );

                isPublic = obj.isPublic;
                if( deep ){
                    return stringData;
                }else{
                    if( isPublic ){
                        if(obj.ast.unobservable){
                            return (_tinyPadLeft + '_self[\'' + obj.getName() + '\'] = ' + stringData)
                        }else{
                            return (_tinyPadLeft + '_self.set(\'' + obj.getName() + '\', ' + stringData + ')')
                        }

                    }else{
                        ctx.mainCls.privatesFlag = true;
                        if(obj.ast.unobservable){
                            return (_tinyPadLeft + '__private[\'' + obj.getName() + '\'] = ' + stringData + '')
                        }else{
                            return (_tinyPadLeft + '__private.set(\'' + obj.getName() + '\', ' + stringData + ')')
                        }
                    }
                }
            }else{
                eventSubs.push(_tinyPadLeft +(isPublic?'this': '__private')+'.setAll('+
                    (obj.isMain?'':'\'' + obj.getName().join('.') + '\', ') + stringData + ')');
                return new ShouldNotBeSetted(obj);
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
