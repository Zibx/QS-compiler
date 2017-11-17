/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 4/25/17.

module.exports = (function () {
    'use strict';
    var ASTtransformer = require('../JS/ASTtransformer');
    var ClassMetadata = require('./ClassMetadata'),
        InstanceMetadata = require('./InstanceMetadata');
    var VarInfo = function(cfg){
        Object.assign(this, cfg);
    };
    VarInfo.prototype = {
        context: false,
        varParts: []
    };
    var tools = {
        primitives: {
            'Number': true, 'String': true, 'Array': true, 'Boolean': true, 'Function': true
        },
        getVarInfo: function (stack, obj, child, scope){
            var i, _i, out = [],
                node, name,
                env, lastEnv, context = false,
                somePointer = obj.ast.name.pointer,
                fromWorld = false,
                deeperEnv;


            for (i = 0, _i = stack.length; i < _i; i++){
                node = stack[i];
                if( node.type === 'Literal' )
                    name = node.value;
                else
                    name = node.name;
                if( !env ){
                    if( node.type === 'ThisExpression' ){
                        name = child.getName();
                    }
                    env = child === obj ? {class: child} : false;

                    if(!env){
                        env = child.findProperty( name );
                        console.log('in child', !!env);
                    }

                    if(!env){
                        env = obj.findProperty( name );
                        console.log('in parent', !!env);
                    }

                    if(!env){
                        if(name in obj.subItems){
                            env = {class: obj.subItems[name]};
                        }
                        console.log('in items', !!env);
                    }

                    if(!env){
                        if(this.world[name]){
                            env = this.world[name];
                            fromWorld = true;
                        }
                        console.log('in world', !!env);
                    }
                }else{
                    deeperEnv = env.findProperty(name);
                    if(!deeperEnv){
                        if(env.getName() === 'Variant' || env.getTag('anything')){
                            deeperEnv = this.world.Variant
                        }
                    }
                    env = deeperEnv;
                }

                if( env instanceof InstanceMetadata ){
                    env = env.class;
                }else if( !(env instanceof ClassMetadata) ){
                    env = env.class;
                }


                if(!env){
                    if(lastEnv.getTag('anything')){
                        env = this.world.Variant;
                    }
                }

                if(env.getName() in tools.primitives){
                    if (context === false) {
                        context = i;
                        // we need to keep context
                        if (env.type === 'Function')
                            context--;
                    }
                }

                out.push({name: name, class: env, node: node});

                lastEnv = env;

            }

            if (!(env.getName() in tools.primitives) && env.getName() !== 'Variant' && !fromWorld) {
                // if it is not primitive and if it is not variant
                env = env.findProperty('value');
                if(env){
                    // and if Class has value property
                    env = env.class;
                    out.push( { name: 'value', class: env, defined: obj, node: ASTtransformer.craft.Literal('value') } );
                }
            }
            return new VarInfo({varParts: out, context: context, used: obj});
        },
        old: function(){
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


                if (!env || env.type !== 'Variant' || this.getTag(this.world[env.type], 'anything')) {

                    if (node.type === 'ThisExpression') {
                        var childAST = child === 'this' ? {
                            type: 'child',
                            'class': obj.extend[0],
                            ast: obj.ast,
                            name: obj.name,
                            values: {}
                        } : obj.itemsInfo[child];
                        env = {type: childAST.class, defined: 'inline',tags: this.world[childAST.class].tags, name: child};
                        thisFlag = true;
                        //envFlag = true;
                    } else {
                        if(metadata === void 0){
                            var basePointer = scope && scope.options && scope.options.basePointer;
                            var loc = {col: node.loc.start.column, row: node.loc.start.line-2};
                            var clonePointer = (basePointer || somePointer).clone();
                            if(basePointer){
                                if(loc.row>0)
                                    clonePointer.col = 0;

                                clonePointer.col+=loc.col;
                                clonePointer.row+=loc.row;

                            }
                            throw new Error('Can not resolve `' + name + '` from `' + lastName +' at '+ clonePointer);

                        }

                        env = metadata.private[name];// this.isNameOfEnv(name, metadata);

                        if (env)
                            envFlag = true;
                    }

                    if (env && i === 0 && env.type in tools.primitives) { // first token is from `self`
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

                    if(node.name in this.world){
                        env = {
                            type: node.name,
                            class: node.name,
                            defined: 'inline',
                            name: node.name
                        };
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

                        if (lastEnv){
                            if(this.getTag(this.world[lastEnv.type], 'anything')) {
                                env = {type: 'Variant'};

                            }else{
                                console.log(out);
                                somePointer.error('Can not resolve `' + name + '` from `' + lastName + '` <' + lastEnv.type + '>',
                                    {row: node.loc.start.line - 1, col: node.loc.start.column + 1}
                                );
                                return false;
                            }
                            //throw new Error('Can not resolve `' + name + '` from `' + lastName + '` <' + lastEnv._type + '>');
                        } else {
                            var basePointer = scope && scope.options && scope.options.basePointer;
                            var loc = {col: node.loc.start.column, row: node.loc.start.line-2};
                            var clonePointer = (basePointer || somePointer).clone();
                            if(basePointer){
                                if(loc.row>0)
                                    clonePointer.col = 0;

                                clonePointer.col+=loc.col;
                                clonePointer.row+=loc.row;

                            }
                            throw new Error(
                                'Unknown variable `' + name + '` in `' + obj.name + '` at '+(clonePointer)//child && child.pointer || somePointer)
                            );

                        }
                    }
                }
                if (env.type in tools.primitives) {
                    metadata = this.world[env.type];
                    if (context === false) {
                        context = i;
                        // we need to keep context
                        if (env.type === 'Function')
                            context--;
                    }
                    //if(i < _i - 1)
                    //    throw new Error('Can not get `'+ stack[i+1].name +'` of primitive value `'+node.name+'` <'+env.type+'>')
                } else {//TODO: go deepeer
                    metadata = this.world[(typeof env.class === 'string' ? env.class : env.class && env.class.data) || env.type]
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
            if (!((env.type in tools.primitives) || env.type === 'Variant')) {
                valueFlag = true;
            }
            if (out[0].prop)
                selfFlag = true;
            if(thisFlag){
                out[0] = {name: child, env: envFlag, prop: propFlag, node: node, e: env};
                //,  ASTtransformer.craft.Literal(env.name);
                thisFlag = false;
            }
            return {
                varParts: out,
                self: selfFlag,
                context: context,
                valueFlag: valueFlag,
                thisFlag: thisFlag
            };
        }
    };
    return tools;
})();