/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 2/7/17.

module.exports = (function () {
    'use strict';

    /* TODO: transform it to linker. we can not collect metadata,
       TODO: it is a recursive operation in quokkaScript
       TODO: we do not know how to traverse a node until
       TODO: we know how to do it
     */
    /*var vm = require('vm'),
        untrusted = function(data){

        },
        parseJSON = function () {

        };
    var x = {setTimeout: setTimeout};
    global.console.log(vm.runInContext('var tral = function(x){' +
        'return (new Function(\'\',\'return \'+x+\';\'))()' +
    '};setTimeout(function(){console.log(22)},1000);10', vm.createContext(x), {timeout: 100})+1);

    //global.console.log(x.tral('((function(){while(1){}})(),{a:2})'))
*/
    //var console = new (require('../../console'))('Compiler');
    var AST_Define = require('../Lexic/ast').AST_Define;
    var AST_Event = require('../Lexic/ast').AST_Event;
    var craft = require('../JS/ASTtransformer').craft;
    //var buildFunction = require('./FunctionTransformer');
    var FunctionTransformer = require('./FunctionTransformer');
    var WaitingDependency = require('./WaitingDependency')
    var VariableExtractor = require('../JS/VariableExtractor');
    var tools = require('./tools');
    var ClassMetadata = require('./ClassMetadata');
    var InstanceMetadata = require('./InstanceMetadata');
    var Property = require('./Property');
    var primitives = tools.primitives,
        escodegen = require('escodegen');

    var cache = function(fn, scope){
        var argumentsCount = fn.length;
        var cache = {},
            join = Array.prototype.join;
        //if(fn.toSource().indexOf('arguments')>-1){
        return function(){
            for(var key = '', i = 0, _i = arguments.length; i < _i; i++)
                key+=arguments[i]+',\n%';

            return key in cache ? cache[key] : cache[key] = fn.apply(scope, arguments);
        }
        /*}else{
         console.log(fn)
         return new Function()
         }*/
    };
    
    var getVarInfo = tools.getVarInfo;
    var varStackFromTree = function(tree){
        var pointer = tree, stack = [];
        if (pointer.object) {

            while (pointer.object) {
                stack.push(pointer.property);
                pointer = pointer.object;
            }
            stack.push(pointer);
            stack = stack.reverse();
        } else {
            stack.push(pointer);
        }
        return stack;
    };

    var varDeepCap = function(pipeVar, accessible, collector, notFirstTime){
        collector = collector || [];
        notFirstTime = notFirstTime || false;
        if(!accessible.length)
            return pipeVar;
        //if(accessible.length < 2) // corner case
            //return pipeVar;


        if(!('object' in pipeVar)){
            //if(pipeVar.name === accessible[0].name){
            collector.push(accessible.shift());
            //}
            if(accessible.length === 0 || !notFirstTime){
                while(accessible.length){
                    collector.push(accessible.shift());
                }
                return craft.Identifier(collector.map(function(el){return el.name}).join('_'));
            }
        }else{
            var clone = Object.create(pipeVar);
            clone.object = varDeepCap(pipeVar.object, accessible, collector, true);
            if(accessible.length > 0) {
                clone.property = varDeepCap(pipeVar.property, accessible, collector, true);
                if(accessible.length === 0)
                    return clone.property;
            }

            //clone.object = craft.Identifier(accessible.join('_'));


            return clone;
        }
        return pipeVar;
    };
    var getVarInfoFromTree = function(tree, cls, whos, compileScope){
        var info,
            stack = varStackFromTree(tree);

        info = getVarInfo.call(this, stack, cls, whos, compileScope);
        if(!info) {
            //console.warn('Weird', stack)
            return false;
        }
        if (info.valueFlag)
            info.varParts.push({name: 'value'});

        return info;
    };
    var getVarAccessor = function (tree, cls, scope, whos, compileScope) {
        var info = getVarInfoFromTree.call(this, tree, cls, whos, compileScope);
        if(info === false)
            return false;
        var accessible;
        if(info.context !== false) {
            accessible = info.varParts.slice(0, info.context + 1);
        }else{
            accessible = info.varParts;
        }
        var ref = (info.varParts[0].name in cls.public ? 'this.ref(':'__private.ref(')+ '\'' + accessible.map(function (el) {
                return el.name;
            }).join('.') + '\')';

        var tail = info.varParts.slice(accessible.length);

        var name = accessible.map(function(el){
            return el.name;
        }).join('_');

        return {ref: ref, tail: tail, name: name, accessible: accessible};


    };
    var bodyParser = function(body){
        var vars = {};
        try {
            vars = VariableExtractor.parse(body.data).getFullUnDefined();
        }catch(e){
            body.pointer.error(e.description, {
                col: e.column,
                row: e.lineNumber - 1 + body.pointer.row
            });
        }
        body.vars = vars;
    };

    var prefab = require('./prefab');
    var buildPipe = function(items, obj, whos, sm){

        var i, _i, out = [], item, realOut = [];
        for(i = 0, _i = items.length; i < _i; i++){
            item = items[i];
            if(item.type==='PIPE'){
                out.push(item);
            }else if(item.tokens){
                out = out.concat(item.tokens, obj);
            }else{
                out.push(item);
            }
        }

        var last;
        for(i = 0, _i = out.length; i < _i; i++){
            if(out[i].type === 'PIPE'){
                realOut.push(last = out[i]);
            }else{
                if(!last || last.type === 'PIPE'){
                    realOut.push(last = out[i]);
                }else if(last.type !== 'PIPE'){
                    if(out[i].data)
                        last.data += out[i].data;
                }else{
                    realOut.push(last = out[i]);
                }
            }

            //console.log(out[i].data,i,_i,out[i])
        }
        var data = (realOut
            .map(function(item){
                return item.type === 'PIPE' ?
                    sm(item)+'('+ sm(item.tokens[0])+item.data +sm(item)+' )' : sm(item)+JSON.stringify(item.data)
            })
            .join('+'));
        var pipe = {data: data, pointer: items[0].pointer, fn: data};

        bodyParser(pipe);


        var pipeSources = [];
        var mutatorArgs = [],
            targetProperty;
        var fn = pipe.fn,
            childId = whos;


        targetProperty = whos;
        /*if (whos !== 'this') {
            childId = 'self';
            targetProperty = prop.name;
        }*/
/*
        if (prop._type === 'Number' || prop._type === 'Array')
            fn = tools.compilePipe.raw(fn);
        else
            fn = tools.compilePipe.string(fn);
*/
        /** do magic */
        /*fn = this._functionTransform(fn);
         fn = {"var1":"cf.cardData.name"," fn ":"JSON.stringify(var1);"};*/
        //console.log(this.functionWaterfall(fn))
        var env, cache = {},
            magicPrefix = '@~#',
            magicLength = magicPrefix.length,
            postProduction = {},
            replaceFn = function(what, position, str){
                var shouldReplace = str.substr(position-magicLength, magicLength) !== magicPrefix;
                if(shouldReplace) {
                    postProduction[newVarName] = true;
                    return magicPrefix + newVarName;
                }else
                    return what;
            };
        for (var cName in pipe.vars) {
            for (var fullName in pipe.vars[cName]) {

                var pipeVars = pipe.vars[cName][fullName];
                for (var i = 0, _i = pipeVars.length; i < _i; i++) {
                    var pipeVar = pipeVars[i];
                    //var source;// = '\'' + fullName + '\'';



                    var accessor = getVarAccessor.call(this, pipeVar, obj, pipe, whos, {options:{
                        basePointer: pipe.pointer, pipe: true
                    }});
                    if(accessor === false) {
                        console.log('NO ACCESSOR FOR', fullName);
                        return false;
                    }


                    var mArg = accessor.name,
                        newVarAST = varDeepCap(pipeVar, accessor.accessible);
                    var newVarName = escodegen.generate(newVarAST),
                        oldVarName = escodegen.generate(pipeVar);
                    var needReplace = !cache[accessor.name] || cache[accessor.name][0] !== pipeVar._id;
                    if (!cache[accessor.name]) {
                        cache[accessor.name] = [pipeVar._id];
                        pipeSources.push(accessor.ref);
                        mutatorArgs.push(mArg);
                    }
                    if(needReplace ) {
                        var goodRegexName = oldVarName.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                        fn = fn.replace(
                            new RegExp(goodRegexName, 'g'),
                            replaceFn
                        );
                    }
                }
            }
        }

        for( i in postProduction ){
            fn = fn.replace(new RegExp((magicPrefix+i).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'g'), i)
        }
        pipe.fn = fn;
        var parts = [];
        pipeSources.forEach(function (item) {
            parts.push(item)
        });
        parts.push('function('+mutatorArgs.join(',')+'){\n' +
            '\t'+sm(pipe)+'return '+ pipe.fn +';\n' +
            '}');
        if(pipeSources.length) {
            return 'new Pipe(' + parts.join(', ') + ')';
        }else{
            return  '('+parts[0]+')()';
        }

        /*'this.createDependency([\n' +
            '\t\t' +
            pipeSources.map(function (item) {
                console.log(item);
                return item;
            }).join(',') +
            '\n\t],' + childId + '.id+\'.' + targetProperty + '\',\n' +
            '\tfunction (' + mutatorArgs.join(',') + ') {\n' +
            '\t\treturn ' + fn + '\n' +
            '\t});';





        data = 'new Pipe(function(){return '+data+'})';

        return data;*/
    };
    var searchForPipes = function(token, i, list){
        if(token.type === 'PIPE')
            return true;

        if(token.type === 'Brace' && token.info === '{' && token.tokens.length === 3){
            var subToken = token.tokens[1];
            if(subToken.type === 'Brace' && subToken.info === '{'){
                list[i] = {
                    type: 'PIPE',
                    tokens: subToken.tokens.slice(1, subToken.tokens.length - 1),
                    pointer: token.pointer,
                    data: subToken.data.substr(1, subToken.data.length - 2)
                };
                return true;
            }
        }


        if(token.tokens)
            if(token.tokens.filter(searchForPipes).length)
                return true;
        return false;
    };

    var tokenizer = require('../Tokenizer'),
        lexer = require('../Preprocess'),
        fs = require('fs'),
        path = require('path'),
        systemQS = function(name){
            var fileName = path.join(__dirname, '../Classes/'+name+'.qs');
            var data = fs.readFileSync(fileName) + '',
                tokens = tokenizer(data, fileName);
            return lexer(tokens);
        },
        systemJS = function(name, multiple){
            var obj = require('../Classes/'+name),
                i, j, out, item, cfg, prop;
            if(!multiple){
                var newOne = {};
                newOne[name] = obj;
                obj = newOne;
            }

            out = [];
            for( i in obj ){
                cfg = Object.create(obj[i]);

                item = new ClassMetadata({
                    //ready: true,
                    js: true,
                    name: {data: i},
                    namespace: cfg.namespace
                });

                if(cfg.public)
                    item.public = Object.create(cfg.public);

                for( j in cfg ){
                    prop = cfg[j];
                    if(j.indexOf('_')===0){
                        if(j.indexOf('__')!==0)
                            j = j.substr(1);

                        (item.tags[j] || (item.tags[j] = []))
                            .push({
                                value: prop
                            });
                    }
                }
                item.ast = item;
                if(cfg.ready){
                    item.ready = true;
                }
                out.push(item);
            }


            return out;
        };

    var convertAST = function(item, additional){

        // already converted
        if(!item.class)
            return item;

        var out = {type: item.class.data}, i;
        if(item.tags){
            out.tags = {};
            for(i in item.tags) {
                out.tags[i] = item.tags[i].map(function (el) {
                    return el.value[0].data;
                });
            }
        }
        if(additional)
            out = Object.assign({}, additional, out);
        return out;
    };
    function readDirRecursive(dirPath, base) {
        if(!base)
            base = '';

        var entries = fs.readdirSync(dirPath);
        var ret = [];
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            var fullPath = path.join(dirPath, entry);
            var stat = fs.statSync(fullPath);
            if (stat.isFile()) {
                ret.push(path.join(base,entry).replace(/\\/g, "/"));
            }
            if (stat.isDirectory()) {

                if(entry[0] !== '.') // SYSTEM
                    ret = ret.concat(readDirRecursive(fullPath, base?path.join(base, entry):entry));
            }
        }
        return ret;
    };
    var files = readDirRecursive(path.join(__dirname,'../Classes'));

    var system = [
        //systemJS('Class'),
        systemJS('QObject'),
        systemJS('Primitives', true)

    ];
    files.forEach(function(file){
        var parts = path.parse(file);
        if(parts.ext === '.qs')
            system.push(systemQS(parts.name))
    })

    var Compiler = function(cfg){
        this.objectCounter = 0;
        typeof cfg === 'object' && Object.assign(this, cfg);
        
        this.isInstanceOf = cache(this.isInstanceOf, this);
        this.world = {};
        this._world = {};
        this.wait = {};
        this.waitingFor = {};
        var _self = this;
        if(cfg && cfg.searchDeps){
            this.searchDeps = function(){

            };
        }

        system.forEach(function(clses, i){
            clses.forEach(function(cls){
                _self.add(cls);
            });
        });

        if(cfg && cfg.searchDeps){
            this.searchDeps = cfg.searchDeps;
        }

    };

    Compiler.prototype = {
        _primitives: primitives,
        world: {},// known metadata
        _world: {},// known metadata with not full loaded
        waitingFor: { // key - waiting for class, value - Array of waiting classes

        },
        // key - waiting class, value - Array of waiting for classes
        wait: {

        },
        getTag: function (obj, name) {
            if(!obj.tags || !obj.tags[name])
                return false;
            var items = obj.tags[name], vals;

            return this.extractFirstTag(items);
        },
        extractFirstTag: function (tagVal) {
            if(!tagVal || !tagVal.length)
                return false;
            if(Array.isArray(tagVal[0].value))
                return tagVal[0].value.map(function(item){return item.data;}).join('');
            else
                return tagVal[0].value;
        },

        addDependency: function(who, item, cb){
            if(who instanceof ClassMetadata){
                who = who.getName();
            }
            var _world = this._world,
                waitingFor = this.waitingFor,
                wait = this.wait[who],
                info = _world[who],
                what;
            if(typeof item === 'string'){
                what = item;
            }else{
                //crazy shit
                what = item.data;

                if( !what )
                    what = item.class && item.class.data;
            }
            if(what === who){
                // sometimes subitems have the same type
                return;
            }
            if(_world[what] === void 0 || !_world[what].ready) {
                (waitingFor[what] || (waitingFor[what] = [])).push(who);
                typeof cb === 'function' && waitingFor[what].push(cb);
                if(wait.indexOf(what) === -1){
                    wait.push( new WaitingDependency(what, item) );
                }
            }else{
                typeof cb === 'function' && cb();
            }

            (info.require[what] || (info.require[what] = [])).push(item);
        },
        /**
         * takes ast
         */
        add: function(ast, cfg){
            var info = ast instanceof ClassMetadata ? ast : new ClassMetadata({
                    name: ast.name,
                    ast: ast
                });

            info.setNameSpace(ast.namespace || ast.getTag('ns'))

            var name = info.getName(),
                inspect = true;
            cfg && Object.assign(info, cfg);
            this._world[name] = info;

            this.wait[name] = [];
            if(!ast.ready){
                if( ast.js ){
                    var i;
                    for( i in ast.public )
                        this.addDependency( name, ast.public[i].type );

                    for( i in ast.private )
                        this.addDependency( name, ast.private[i].type );
                    /*ast.extend
                        .forEach(this.addDependency.bind(this, name));*/

                    //info.ready = true;
                }else{
                    ast.extend
                        .forEach( this.addDependency.bind( this, name ) );

                    var _self = this;
                    var notInWorld = this.wait[name].filter( function( name ){
                        return !(name in _self._world);
                    } );
                    if(notInWorld.length){
                        this.searchDeps && this.searchDeps( notInWorld );
                        inspect = false;
                    }
                }
            }
            inspect && this.tryInspect(name);

        },
        addNative: function(info){
            var name = info.name,
                ns = info.namespace,
                ctor = info.ctor,
                props = ctor.prototype._prop, i,
                proto = ctor.prototype;

            var obj = this.world[name] = this._world[name] = new ClassMetadata({
                name: name,
                //ready: true,
                js: true,
                ast: {native: true}
            }).setNameSpace(ns);

            this.wait[name] = [];

            if(info.ctor.parent){
                var parentName = info.ctor.parent.name;
                obj.ast = { extend: [{ data: parentName}] };
                var _self = this;
                this.addDependency(name, parentName, function(){
                    obj.__extend(parentName, _self.world[parentName]);
                });

            }

            if(props)
                for( i in props){
                    obj.addPublic(i, {type: 'Variant', defined: name })
                }
            for( i in proto ){
                if(i==='_prop' || i==='_method')
                    continue;
                var prop = proto[i];

                if(i.indexOf('#')===0)
                    i = i.substr(1);
                if(i.indexOf('_')===0){
                    if(i.indexOf('__')!==0) {
                        i = i.substr(1);
                    }
                    obj.addTag(i, {data: prop});
                }else if(typeof prop === 'function'){
                    obj.addPublic(i, {type: 'Function', defined: ns });
                }
            }



            /*if(obj.ast.extend)
                obj.ast.extend
                    .forEach(this.addDependency.bind(this, name));*/
            this.tryInspect(name);
            //this.loaded(name);


            //debugger;
        },
        applyAST: function(to, from, additional){
            var i;
            for(i in from){
                to[i] = convertAST(from[i], additional);
            }
            return to;
        },
        tryCall: function(name, fnName, args, cb){
            var info;
            if(name instanceof ClassMetadata){
               info = name;
            }else{
                info = this.world[name];
            }
            if(!info)
                return cb('no such class `'+ name +'`');

            var after = info.findMethod(fnName),
                result;

            if(!after)
                return cb('no such function `'+ fnName +'`');

            if(typeof after !== 'function') {
                after = new Function('', 'return ' + after)();
            }

            if( typeof after === 'function'){
                result = after.apply(this, args || []);
                if(typeof cb === 'function')
                    return cb(false, result);
            }else{
                return cb('not a function `'+ fnName +'`');
            }
        },
        getPropertyValue: function (item, obj, whos, sm) {
            //console.log(item);
            var info = item.getValue(),

                arr,
                ohNoItSPipe = false,
                result;

            //global.console.log(item.name+' <'+property.type+'>')
            if(info.type === 'DEEP'){
                debugger
            }
            if(info.type === 'FUNCTION'){
                var transform = new FunctionTransformer(item, obj, whos, this);
                return transform.transform();//buildFunction.call(this, item, obj, whos, sm);
            }
            if( info.type === 'Function'){
                //item.item._matchers.func({tokens: item.item.value,matched: item.item, item: item})
                var transform = new FunctionTransformer(item.ast.value, obj, whos, this);

                return transform.transform();//buildFunction.call(this, item.ast.value, obj, whos, sm);
            }
            if(info.type === 'PIPE'){
                return 'function(){'+info.data+'}';
            }

            var propName = item.getName();

            var property = item.class;
            var ast = item instanceof AST_Define ? item : item.ast;

            arr =  ast.value;
            if(!Array.isArray(arr))arr = [arr];
            arr = arr.map(function (val, i, list) {
                if(searchForPipes(val, i, list))
                    ohNoItSPipe = true;

                if(val.type==='Quote')
                    return val._data;
                else
                    return val.data;
            });
            if(ohNoItSPipe){
                var out = buildPipe.call(this, ast.value, obj, whos, sm);

                // HAIL TAUTOLOGY!
                if(out === false) {
                    return false;
                    return new Error('Can not get value ' + ast.value[0].pointer);
                }
                return out;

            }

            // typed property getter
            var error = false;
            this.tryCall(property, '__compileValue', [arr, ast.value], function(err, res){
                error = err;
                if(!err)
                    result = res;
            });
            if(!error)
                return result;

            //global.console.log(error)

            //ok, lets guess
            var className;
            if(property instanceof InstanceMetadata){
                className = property.class.getName();
            }else if(property instanceof ClassMetadata){
                className = property.getName();
            }
            if(className !== 'Variant'){
                var name = arr[0];
                if(arr.length === 1){
                    if(item instanceof AST_Event){
                        if (name in obj.private || name in obj.public) {
                            return (name in obj.private ? '__private' : '_self') + '.get(' + JSON.stringify(name) + ')';
                        }
                    }else {
                        if (name in obj.private || name in obj.public) {
                            return (name in obj.private ? '__private' : '_self') + '.ref(' + JSON.stringify(name) + ')';
                        }
                    }
                }
                if(name in this.world){
                    if(!(name in obj.require)){
                        obj.require[name] = [];
                    }
                    obj.require[name].push(item.ast);
                    //obj.re
                    this.addDependency(obj, name);
                    return name;
                }
                var error = false;
                this.tryCall('Variant', '__compileValue', [arr, item.ast.value], function(err, res){
                    error = err;
                    if(!err)
                        result = res;
                });
                if(!error)
                    return result;
            }else{

            }
            throw new Error('UNEXCEPTABLE VALUE! '+ arr.join(''))
            return JSON.stringify(arr.join(''));
        },
        define: function(name){
            var info = this._world[name],
                ast = info.ast, i, _i, extend,
                mixed,
                clsInfo,
                items, item, itemName,
                moreDependencies = false,
                _self = this;

            mixed = this.world[name] = info.mixed = info.mixed || (
                info instanceof ClassMetadata ?
                    info :
                    new ClassMetadata({
                        require: info.require,
                        name: name,
                        ast: ast
                    })
                );
            if(!mixed.js){
                extend = ast.extend;

                if(!info.isMixed) {
                    for (i = 0, _i = extend.length; i < _i; i++) {
                        clsInfo = this.world[extend[i].data];
                        mixed.extend(clsInfo);
                    }
                    info.isMixed = true;
                }
                if(!info.isInternalsGenerated) {
                    // if deps are resolved - try collect information about props\children


                    mixed.instances = {};
                    mixed.variables = {};
                    mixed.values = {};
                    mixed.events = {};

                    
                    if(this.__dig(mixed, mixed)===false) {
                        if(this._world[name]){

                            if( this.wait[name].length ){
                                // deps that are not in world yet
                                var notInWorld = this.wait[name].filter( function( name ){
                                    return !(name in _self._world);
                                } );
                                notInWorld.length && this.searchDeps && this.searchDeps( notInWorld );
                            }
                        }
                        

                        return false;
                    }

                    info.isInternalsGenerated = true;
                }
                // TODO if(no other deps)
                this.world[name] = mixed;
                if(ast.tags){
                    mixed.tags = ast.tags;
                }
                //mixed.setNameSpace(ast.getTag('ns'));
                info.ready = true;
                //debugger
            }else{
                for( i in info.private){
                    if(!(info.private[i] instanceof InstanceMetadata)){
                        info.private[i] = new InstanceMetadata( {
                            class: this.world[info.private[i].type],
                            name: i,
                            isPublic: true
                        } );
                    }
                }
                for( i in info.public){
                    if(!(info.public[i] instanceof InstanceMetadata)){
                        info.public[i] = new InstanceMetadata( {
                            class: this.world[info.public[i].type],
                            name: i,
                            isPublic: true
                        } );
                    }
                }
                this.world[name] = info;
                info.ready = true;
            }

        },
        getUID: function(cls){
            var generatedName = cls+'_I'+(++this.objectCounter); 
            return generatedName;
        },
        tryInspect: function(name){
            // collecting metadata and compiling are possible only after all
            // dependences are resolved

            if(this.wait[name].length === 0){
                console.combine(name, function(arr){
                    console.log('LOADED', arr.sort().join(', '));
                });//, this._world[name])
                this.define(name);

            }else{
                //console.log(this.wait[name])
            }

            if(this._world[name].ready){
                this.loaded(name);
            }
        },
        compile: function (name, cfg) {
            return this.callMethod('__compile', this.world[name], cfg || {});
        },
        callMethod: function(method, obj){
            var fn = obj.findMethod(method);
            if(fn === false){
                fn = prefab[method];
            }
            if(fn === false){
                throw new Error('NO WAY. UNKNOWN METHOD', method);
            }
            return fn.apply(this, Array.prototype.slice.call(arguments,1));
        },
        loaded: function(name){
            var i, _i, waitingForList = this.waitingFor[name], waitList,
                waitingItem, callbacks = [],
                j;
            if(waitingForList){
                for(i = 0, _i = waitingForList.length; i < _i; i++){
                    // remove class from wait list
                    waitingItem = waitingForList[i];
                    if( typeof waitingItem === 'function' ){
                        callbacks.push( waitingItem );
                    }
                }

                for( i = 0, _i = callbacks.length; i < _i; i++){
                    callbacks[i].call( this.world[name] );
                }

                for(i = 0, _i = waitingForList.length; i < _i; i++){
                    // remove class from wait list
                    waitingItem = waitingForList[i];
                    if(typeof waitingItem !== 'function'){
                        waitList = this.wait[waitingItem];
                        for( j = waitList.length; j; )
                            if( waitList[--j].toString() === name )
                                waitList.splice( j, 1 );
                        if( waitList.length === 0 )
                            this.tryInspect( waitingItem );
                    }
                }
                delete this.waitingFor[name];
            }

        },
        isInstanceOf: function (who, whosInstance) {
            if(who.data)
                who = who.data;

            var info = this.world[who],
                extend, i, _i,
                parentName;

            if(!info)
                return false;

            if(!info.ast)
                return false;

            extend = info._extendList;
            if(!extend)
                return false;

            for(i=0, _i = extend.length; i < _i; i++){
                parentName = extend[i];
                if(parentName.data)
                    parentName = parentName.data;

                if(parentName === whosInstance)
                    return true;

                if(this.isInstanceOf(parentName, whosInstance))
                    return true;
            }
            return false;
        },
        /*
        @arg obj: inspecting object
        @arg cls: class of defining object
        @arg path:Array path to inspecting object

         */
        __dig: function(obj, cls, path) {
            var ast = obj.ast,
                i, _i, items,
                moreDependencies = false,
                prop, anything,

                searchingFor, item;

            path = path || [];

            if(ast.type === 'DEFINE'){
                items = obj.ast.items;

                for (i = 0, _i = items.length; i < _i; i++) {

                    anything = false;

                    item = items[i];

                    searchingFor = (item.class || item.name).getValue();
                    /* we can define:
                     Label: without name.
                     Label with: name
                     existed: prop

                     so we check that class dependency is satisfied.*/

                    // maybe we have property with that name

                    if(!obj.findProperty(searchingFor) && !obj.getTag('anything')){
                        this.addDependency(cls.getName(), item.class || item.name);
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
                    var objClass = obj._extendList[0];
                    if(!objClass)
                        objClass = obj.class.getName();

                    //console.log(this.wait[cls.getName()])
                    console.log('More deps for '+ obj.getName() + '<'+objClass+'> in `' + cls.getName() + '`: ' + this.wait[cls.getName()].join(', ')+' '+cls.ast.name.pointer);
                    ///obj.findProperty(searchingFor)
                    return false;
                }

                // now deps are loaded
                var objectName = obj.name;
                if(obj === cls) {
                    objectName = '___this___';
                }

                for (var eventName in obj.ast.events) {
                    obj.ast.events[eventName].forEach(function (event) {
                        obj.addEvent(event.name.getValue(), event); // was event.value
                    });
                }
                if(obj.value && obj.value.length){
                    obj.addValue( 'value', new Property( {
                        name: ['value'],
                        ast: obj.ast,
                        class: obj.findProperty('value'),
                        value: obj.value
                    } ) );
                }
                if(obj.cls && obj.cls.length){
                    obj.addValue( 'cls', new Property( {
                        name: ['cls'],
                        ast: Object.assign( Object.create( obj.ast ), { value: obj.cls } ),
                        class: obj.findProperty('cls'),
                        value: obj.cls
                    } ) );
                }

                items = obj.ast.items;

                var anything = obj.getTag('anything');
                for (i = 0, _i = items.length; i < _i; i++) {
                    item = items[i];
                    var propInMeta;

                    searchingFor = (item.class || item.name).getValue();
                    propInMeta = obj.findProperty(searchingFor);

                    //var itemPath = path.slice(1).concat(searchingFor);
                    if(!propInMeta && !(searchingFor in this.world)){
                        if(anything){
                            // logic of Variants. maybe extend with custom type casting later
                            propInMeta = this.world.Variant;
                        }
                    }
                    if (propInMeta) {
                        // is property
                        var val;
                        if(!propInMeta.ast.existed || item.items.length){
                            obj.addValue( searchingFor, new Property( {
                                name: ['value'],
                                ast: item, //was item
                                class: propInMeta,
                                value: item.value,
                                existed: propInMeta.ast.existed
                            } ) );
                        }
                        //cls.addItem(objectName, val); // join path?

                        var childObjectName = objectName;
                        if( item.cls && item.cls.value ){
                            obj.addValue( searchingFor + '.cls', new Property( {
                                class: this.world.String,
                                name: [ 'cls' ],
                                ast: Object.assign( Object.create( item ), { value: item.cls } ), //was item
                                //info: item.findProperty('cls'),
                                value: item.cls.value
                            } ) );
                        }
                        if(item.items.length || propInMeta.ast.existed){
                            var itemClass;
                            if(propInMeta instanceof InstanceMetadata){
                                itemClass = propInMeta.class;
                            }else{
                                if(propInMeta.getTag('anything')){
                                    itemClass = this.world.Variant;
                                }else{
                                    throw new Error('Item has')
                                }
                            }

                            var childItem = new InstanceMetadata({
                                class: itemClass,
                                ast: item,
                                name: path.concat(searchingFor),
                                defineAST: propInMeta,
                                isPublic: item.isPublic,
                                value: item.value,
                                existed: propInMeta.ast.existed,
                                unobservable: propInMeta.ast.unobservable
                            });



                            obj.addValue( searchingFor, childItem)

                            if(this.__dig( childItem, cls, path.slice().concat( searchingFor ) ) === false){
                                // more deps in nested node
                                return false;
                            }


                        }
                    }else if (searchingFor in this.world) { // is not known property. class name?

                        var childItem = new InstanceMetadata({
                            class: this.world[searchingFor],
                            ast: item,
                            isPublic: item.isPublic,
                            value: item.value,
                            cls: item.cls
                        });

                        if(childItem.class.getName() === 'Function'){
                            childItem.type = 'inline';
                        }

                        if (!childItem.getName()){
                            childItem.setName(this.getUID(childItem.class.getName()));
                            childItem.noName = true;
                        }

                        if(this.__dig(childItem, cls, [childItem.getName()]) === false){
                            return false;
                        }

                        cls.addItem((typeof objectName === 'string' ? objectName : (Array.isArray(objectName)?objectName.join('.'):objectName.data)), childItem); // TODO check if condition is needed

                    }


                }

            }
        }

    };

    Compiler.Property = Property;
    Compiler.InstanceMetadata = InstanceMetadata;
    Compiler.ClassMetadata = ClassMetadata;

    return Compiler;
})();