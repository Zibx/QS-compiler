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
    var prefab = require('./prefab');

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

    var tokenizer = require('../Tokenizer'),
        lexer = require('../Preprocess'),
        fs = require('fs'),
        systemQS = function(name){
            var fileName = './Core/Classes/'+name+'.qs';
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
        systemJS('Primitives', true),
        systemQS('Page'),
        systemQS('UIComponent'),
        systemQS('VBox'),
        systemQS('Timer')

    ];

    var Compiler = function(){
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
        addDependency: function(who, item){
            var _world = this._world,
                waitingFor = this.waitingFor,
                wait = this.wait[who],
                info = _world[who],
                what = item.data;

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
        applyAST: function(to, from, additional){
            var i;
            for(i in from){
                to[i] = convertAST(from[i], additional);
            }
        },
        define: function(name){
            var info = this._world[name],
                ast = info.ast, i, _i, extend,
                mixed = info.mixed = info.mixed || {
                    public: {},
                    private: {},
                    values: {},
                    require: info.require,
                    extend: []
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

                items = info.ast.items;
                for(i = 0, _i = items.length; i < _i; i++){
                    item = items[i];
                    itemName = (item.class && item.class.data) || (item.name && item.name.data);
                    if(
                        (itemName in mixed.public) ||
                        (itemName in mixed.private)
                    ){

                    }else if(itemName in this.world){

                    }else{
                        moreDependencies = true;
                        this.addDependency(name, item.class);
                    }
                    mixed.values[itemName] = item.value;
                }
                /*
                1) create named with not piped properties or inline pipes to properties that are already defined
                2) create unnamed with inline pipes
                3) create other pipes
                4) add items as children
                 */

                if(moreDependencies) {
                    console.log('More deps for `'+name+'`: '+this.wait[name])
                    return;
                }

                // if deps are resolved - try collect information about props\children
                var internals = [];
                for(i = 0, _i = items.length; i < _i; i++) {
                    item = items[i];
                    itemName = (item.class && item.class.data) || (item.name && item.name.data);
                    if(
                        (itemName in mixed.public) ||
                        (itemName in mixed.private)
                    ){
                        internals.push({type: 'property', name: itemName, item: item});
                    }else if(itemName in this.world){
                        internals.push({type: 'child', class: item.class.data, item: item});
                    }
                }

                console.log(internals)

                this.applyAST(mixed.public, info.ast.public, {defined: name});
                this.applyAST(mixed.private, info.ast.private, {defined: name});

                // TODO if(no other deps)
                this.world[name] = mixed;
                if(ast.tags){
                    mixed.tags = ast.tags;
                }
                mixed.name = name;
                info.ready = true;
                //debugger
            }else{
                //debugger;
                this.world[name] = info.ast;
            }

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
        compile: function (name) {
            return this.callMethod('__compile', this.world[name]);
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
            return fn.call(this, obj);
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