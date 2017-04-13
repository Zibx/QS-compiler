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
    var VariableExtractor = require('../JS/VariableExtractor');
    var primitives = {
        'Number': true, 'String': true, 'Array': true, 'Boolean': true, 'Function': true
    },
        escodegen = require('escodegen');;
    var getVarInfo = function (stack, obj, child) {

        var metadata = obj;

        var i, _i, out = [], node, env, selfFlag = false, context = false,
            envFlag, propFlag, valueFlag = false, thisFlag = false, lastEnv, lastName,

            firstTry = true,

            somePointer = obj.ast.name.pointer,


            name;
        for (i = 0, _i = stack.length; i < _i; i++) {

            envFlag = propFlag = false;

            node = stack[i];
            if (node.type === 'Literal')
                name = node.value;
            else
                name = node.name;

            if (!env || env.type !== 'Variant') {

                if (node.type === 'ThisExpression') {
                    env = child;
                    thisFlag = true;
                } else {
                    env = metadata.private[name];// this.isNameOfEnv(name, metadata);

                    if (env)
                        envFlag = true;
                }

                if (env && i === 0 && env.type in primitives) { // first token is from `self`
                    selfFlag = true;
                }

                if (!env) {
                    env = metadata.public[name];//this.isNameOfProp(name, metadata);
                    /*
                    if (!env)
                        env = this.isNameOfProp(name, shadow[metadata._type]);
                    */
                    if (env)
                        propFlag = true;
                }

                if (!env) {
                    if(firstTry){
                        // on first search we can try to find prop in root parent info
                        metadata = obj;
                        if(metadata){
                            i--;
                            firstTry = false;
                            continue;
                        }
                    }

                    if (lastEnv) {
                        console.log(out);
                        somePointer.error('Can not resolve `' + name + '` from `' + lastName + '` <' + lastEnv.type + '>',
                            {row: node.loc.start.line-1, col: node.loc.start.column+1}
                        );
                        return false;
                        //throw new Error('Can not resolve `' + name + '` from `' + lastName + '` <' + lastEnv._type + '>');
                    } else
                        throw new Error('Unknown variable `' + name + '`');
                }
            }
            if (env.type in primitives) {
                metadata = this.world[env.type];
                if (context === false) {
                    context = i;
                    // we need to keep context
                    if (env._type === 'Function')
                        context--;
                }
                //if(i < _i - 1)
                //    throw new Error('Can not get `'+ stack[i+1].name +'` of primitive value `'+node.name+'` <'+env.type+'>')
            } else {//TODO: go deepeer
                metadata = this.world[env.type]
                //var x;
                /*
                metadata = shadow[env._type];

                if(!metadata)
                    metadata = cls.root.scope.metadata[env._type];
                if(!metadata)
                    debugger;
                    */
            }
            out.push({ name: name, env: envFlag, prop: propFlag, node: node, e: env });
            lastEnv = env;
            lastName = name;
            firstTry = false;
        }
        if (!(env.type in primitives || env.type === 'Variant')) {
            valueFlag = true;
        }
        if (out[0].prop)
            selfFlag = true;

        return {
            varParts: out,
            self: selfFlag,
            context: context,
            valueFlag: valueFlag,
            thisFlag: thisFlag
        };
    };
    var getVarAccessor = function (tree, cls, scope) {
        var pointer = tree, stack = [],
            info;
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

        info = getVarInfo.call(this, stack, cls);
        if(!info)
            return false;
        if (info.valueFlag)
            info.varParts.push({name: 'value'});

        return info.varParts[0].name+'.ref('+ (info.varParts.length>1?'\''+ info.varParts.slice(1).map(function(item){return item.name;}).join('.') +'\'':'') +')'/*(info.self ? 'self.id+\'.' : '\'') + info.varParts.map(function (el) {
                return el.name;
            }).join('.') + '\'';*/
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
    var objectCounter = 0;
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
        var env, cache = {};
        for (var cName in pipe.vars) {
            for (var fullName in pipe.vars[cName]) {

                var pipeVars = pipe.vars[cName][fullName];
                for (var i = 0, _i = pipeVars.length; i < _i; i++) {
                    var pipeVar = pipeVars[i];
                    //var source;// = '\'' + fullName + '\'';
                    var source = getVarAccessor.call(this, pipeVar, obj);
                    if(source === false)
                        return false;
                    if (!cache[source]) {
                        cache[source] = true;
                        pipeSources.push(source);

                        var mArg = fullName.replace(/\./g, ''),
                            varName = escodegen.generate(pipeVar);
                        mutatorArgs.push(mArg);

                        fn = fn.replace(new RegExp(varName.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'g'), mArg);
                    }
                }
            }
        }

        pipe.fn = fn;
        var parts = [];
        pipeSources.forEach(function (item) {
            parts.push(item)
        });
        parts.push('function('+mutatorArgs.join(',')+'){\n' +
            '\t'+sm(pipe)+'return '+ pipe.fn +';\n' +
            '}');
        return 'new Pipe('+parts.join(', ')+')';

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
            }
        }


        if(token.tokens)
            if(token.tokens.filter(searchForPipes).length)
                return true;
        return false;
    };
    /*
    var get = function(){

    };
    var extract = function(ast){
        //debugger;
        var i, prop, propClass, item, itemClass;

        var metadata = {};

        var info = {
            require: {},
            exports: {}
        };

        for(i in ast.public) {
            prop = ast.public[i];
            propClass = prop.class;
            info.exports[i] = prop;
            //(info.require[propClass.data] || (info.require[propClass.data] = [])).push(prop);
        }

        info.exports[ast.name.data] = ast.name;
        var localVars = {};
        for(i in ast.items) {
            item = ast.items[i];
            itemClass = item.class;
            //info.exports[i] = prop;
            (info.require[itemClass.data] || (info.require[itemClass.data] = [])).push(item);
            // TODO items public props to exports
            if(item.name)
                localVars[item.name.data] = item.name;
        }
        ast.extend.forEach(function(item){
            (info.require[item.data] || (info.require[item.data] = [])).push(item);
        });



        for( i in ast.events ){
            ast.events[i].forEach(function(event){
                if(event.value.type === 'FUNCTION'){
                    var vars = event.value.body.vars;

                    for(var j in vars) {
                        !localVars[j] && (info.require[j] || (info.require[j] = [])).push(vars[j]);
                    }
                }


                // TODO substract event body variables from locals.
                // otherwise - store as unknown required
            });
        }

        if(info.exports.value === void 0){
            info.exports.value = {};
        }
        //console.log(ast.unclassified[0].tokens);
        //console.log(ast.events.endEvt[0].value);
        return info;
    };
    //return {extract: extract, get: get};
*/
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
            var obj = require('../Classes/'+name), i, out, item;
            if(multiple){
                out = [];
                for( i in obj ){
                    item = {
                        ready: true,
                        js: true,
                        name: {data: i}
                    };
                    if(obj[i].public)
                        item.public = obj[i].public;

                    out.push(item);
                }
            }else{
                obj.ready = true;
                obj.js = true;
                obj.name = {data: name};//'Classes/'+name+'.js'};
                out = [obj];
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
    var system = [
        systemJS('Class'),
        systemJS('QObject'),
        systemJS('Primitives', true),
        systemQS('Page'),
        systemQS('UIComponent'),
        systemQS('VBox'),
        systemQS('Timer'),
        systemQS('Slider'),
        systemQS('Label')

    ];

    var Compiler = function(cfg){

        typeof cfg === 'object' && Object.assign(this, cfg);

        this.world = {};
        this._world = {};
        this.wait = {};
        this.waitingFor = {};
        var _self = this;
        system.forEach(function(clses){
            clses.forEach(function(cls){
                _self.add(cls);
            });
        });

    };
    Compiler.prototype = {
        world: {},// known metadata
        _world: {},// known metadata with garbage
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

            return tagVal[0].value.map(function(item){return item.data;}).join('');
        },
        addDependency: function(who, item){

            var _world = this._world,
                waitingFor = this.waitingFor,
                wait = this.wait[who],
                info = _world[who],
                what = item.data;
            if(!what)
                what = item.class && item.class.data;
            if(_world[what] === void 0 || !_world[what].ready) {
                (waitingFor[what] || (waitingFor[what] = [])).push(who);
                if(wait.indexOf(what) === -1)
                    wait.push(what);
            }

            (info.require[what] || (info.require[what] = [])).push(item);
        },
        /**
         * takes ast
         */
        add: function(ast){
            var info = {
                    require: {},
                    exports: {},
                    ast: ast,
                    ready: false
                },
                name = ast.name.data;

            this._world[name] = info;

            this.wait[name] = [];

            if(ast.js)
                info.ready = true;
            else
                ast.extend
                    .forEach(this.addDependency.bind(this, name));

            this.tryInspect(name);

        },
        addNative: function(info){
            var name = info.name,
                ns = info.namespace,
                ctor = info.ctor,
                props = ctor.prototype._prop, i;

            var obj = this.world[name] = {
                public: {},
                private: {},
                values: {},
                require: info.require,
                extend: [],
                name: name,
                namespace: ns,
                variables: {},
                props: {},
                tags: {ns: [{data: ns}]},
                ready: true,
                js: true
//                ast: ast
            };
            if(props)
                for( i in props){
                    obj.public[i] = {type: 'Variant', defined: name };//props[i];
                }
            this.loaded(name);

            //debugger;
        },
        applyAST: function(to, from, additional){
            var i;
            for(i in from){
                to[i] = convertAST(from[i], additional);
            }
        },
        getPropertyValue: function (item, obj, whos, sm) {
            //console.log(item);
            var info = item.info || item,

                arr,
                ohNoItSPipe = false;
            if(info.type === 'FUNCTION'){
                return 'function(){'+info.body.data+'}';
            }
            if(info.type === 'PIPE'){
                return 'function(){'+info.body.data+'}';
            }
            arr = item.item.value.map(function (val, i, list) {

                if(searchForPipes(val, i, list))
                    ohNoItSPipe = true;
                return sm(val) + val.data;
            });
            if(ohNoItSPipe){
                var out = buildPipe.call(this, item.item.value, obj, whos, sm);

                // HAIL TAUTOLOGY!
                if(out === false)
                    return new Error('Can not get value');

                return out;

            }
            if(info && info.type === 'Number')
                return arr.join('');

            return JSON.stringify(arr.join(''));
        },
        define: function(name){
            var info = this._world[name],
                ast = info.ast, i, _i, extend,
                mixed = this.world[name] = info.mixed = info.mixed || {
                    public: {},
                    private: {},
                    values: {},
                    require: info.require,
                    extend: [],
                    name: name,
                    variables: {},
                    props: {},
                    ast: ast
                },
                clsInfo,
                items, item, itemName,
                moreDependencies = false;

            if(!ast.js){
                extend = ast.extend;

                if(!info.isMixed) {
                    for (i = 0, _i = extend.length; i < _i; i++) {
                        clsInfo = this.world[extend[i].data];
                        if (!clsInfo.public) {
                            clsInfo.public = {};
                        }
                        if (!clsInfo.private) {
                            clsInfo.private = {};
                        }
                        this.applyAST(mixed.public, clsInfo.public, {defined: extend[i].data});
                        this.applyAST(mixed.private, clsInfo.private, {defined: extend[i].data});
                        mixed.extend.push(extend[i].data);
                    }
                    info.isMixed = true;
                }
                if(!info.isInternalsGenerated) {
                    // if deps are resolved - try collect information about props\children


                    //console.log(internals)
                    if(this.callMethod('__dig', mixed, mixed)===false) {
                        if(this.wait[name].length)
                            this.searchDeps && this.searchDeps(this.wait[name]);
                        return false;
                    }

                    this.applyAST(mixed.public, info.ast.public, {defined: name});
                    this.applyAST(mixed.private, info.ast.private, {defined: name});
                    info.isInternalsGenerated = true;
                }
                // TODO if(no other deps)
                //this.world[name] = mixed;
                if(ast.tags){
                    mixed.tags = ast.tags;
                }
                mixed.namespace = this.getTag(ast, 'ns');
                info.ready = true;
                //debugger
            }else{
                //debugger;
                this.world[name] = info.ast;
            }

        },
        getUID: function(cls){
            return cls+'_I'+(++objectCounter);
        },
        tryInspect: function(name){
            // collecting metadata and compiling are possible only after all
            // dependences are resolved

            if(this.wait[name].length === 0){
                console.log('LOADED', name);//, this._world[name])
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
        findMethod: function(method, obj){
            var i, _i, fn;

            obj.public
            obj.private
            //if(obj.tags)
              //  debugger;

            if(!obj.extend)
                return false;

            for(i = 0, _i = obj.extend.length; i < _i; i++){
                fn = this.findMethod(method, this.world[obj.extend[i]]);
                if(fn)
                    return fn;
            }
            return false;
        },
        callMethod: function(method, obj){
            var fn = this.findMethod(method, obj);
            if(fn === false){
                fn = prefab[method];
            }
            if(fn === false){
                throw new Error('NO WAY. UNKNOWN METHOD');
            }
            return fn.apply(this, Array.prototype.slice.call(arguments,1));
        },
        loaded: function(name){
            var i, _i, waitingForList = this.waitingFor[name], waitList,
                j;
            if(waitingForList){
                for(i = 0, _i = waitingForList.length; i < _i; i++){
                    // remove class from wait list
                    waitList = this.wait[waitingForList[i]];
                    for(j = waitList.length; j;)
                        if(waitList[--j] === name)
                            waitList.splice(j,1);
                    if(waitList.length === 0)
                        this.tryInspect(waitingForList[i]);
                }
                delete this.waitingFor[name];
            }
        }
    };
    return Compiler;
})();