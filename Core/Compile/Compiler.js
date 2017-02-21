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
        systemJS = function(name){
            var obj = require('../Classes/'+name);
            obj.ready = true;
            obj.js = true;
            obj.name = {data: name};//'Classes/'+name+'.js'};
            return [obj];
        };

    var system = [
        systemQS('Page'),
        systemQS('UIComponent'),
        systemJS('Class')
    ];

    var Compiler = function(){
        var _self = this;
        system.forEach(function(clses){
            clses.forEach(function(cls){
                _self.add(cls);
            });
        });

    };
    Compiler.prototype = {
        world: {},// known metadata
        waitingFor: { // key - waiting for class, value - Array of waiting classes

        },
        // key - waiting class, value - Array of waiting for classes
        wait: {

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
                name = ast.name.data,
                world = this.world;

            this.world[name] = info;

            var waitingFor = this.waitingFor,
                wait = this.wait[name] = [];
            if(ast.js)
                info.ready = true;
            else
                ast.extend.forEach(function(item){
                    if(world[item.data] === void 0 || !world[item.data].ready) {
                        (waitingFor[item.data] || (waitingFor[item.data] = [])).push(name);
                        wait.push(item.data);
                    }

                    (info.require[item.data] || (info.require[item.data] = [])).push(item);
                });

            this.tryInspect(name);

        },
        tryInspect: function(name){
            // collecting metadata and compiling are possible only after all
            // dependences are resolved

            if(this.wait[name].length === 0){
                console.log('LOADED', name)
            }else{
                console.log(this.wait[name])
            }

            if(this.world[name].ready){
                this.loaded(name);
            }
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