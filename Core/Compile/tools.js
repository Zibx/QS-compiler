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
        pad: function(number, symbol){
            return new Array(number+1).join(symbol||' ');
        },
        indent: function (number, data) {
            if (!number)
                return data;

            var indent = (new Array(number + 1)).join('\t');
            if (Array.isArray(data))
                return data.map(function (line) {
                    return indent + line;
                });
            else
                return this.indent(number, data.split('\n')).join('\n');
        },
        primitives: {
            'Number': true, 'String': true, 'Array': true, 'Boolean': true, 'Function': true
        },
        getVarInfo: function (stack, obj, child, scope){
            var i, _i, out = [],
                node, name,
                env, lastEnv, context = false,
                somePointer = obj.ast.name.pointer,
                fromWorld = false,
                deeperEnv,
                selfFlag = false,
                implicit = false
            ;

            var stackList = [];
            for (i = 0, _i = stack.length; i < _i; i++){
                node = stack[i];
                if( node.type === 'Literal' )
                    name = node.value;
                else
                    name = node.name;

                stackList.push(name);

                if( !env ){
                    if( node.type === 'ThisExpression' ){
                        name = child.getName();
                        selfFlag = true;
                        env = {class: child};
                    }
/*
                    // TODO: strange logic. check it. upd: Checked. removed
                    if(child === obj) {
                        env = {class: child};
                        !!env && console.log('This expression. This is', child.getName(),'<'+ child._extendList[0] +'>');
                    }*/


                    if(!env){
                        env = child.findProperty( name );
                        !!env && console.log(name, '<'+ env.class.getName() +'>', 'is in child item');
                        selfFlag = true;

                        implicit = true;

                    }

                    if(!env){
                        env = obj.findProperty( name );
                        !!env && console.log(name, '<'+ env.class.getName() +'>', 'is in scope');
                    }

                    if(!env){
                        if(name in obj.subItems){
                            env = {class: obj.subItems[name]};

                        }
                        !!env && console.log(name, '<'+ env.class.getName() +'>', 'is in sub items of child');
                    }

                    if(!env){
                        if(this.world[name]){
                            env = this.world[name];
                            fromWorld = true;
                        }
                        !!env && console.log(name, 'is global Class name');
                    }
                }else{
                    deeperEnv = env.findProperty(name);
                    !!deeperEnv && console.log('\t', name,'<'+ deeperEnv.class.getName() +'>', 'is property of <'+ env.getName() +'>');
                    if(!deeperEnv){
                        if(env.getName() === 'Variant' || env.getTag('anything')){
                            deeperEnv = this.world.Variant
                        }else{
                            var suggestions = [];
                            suggestions = suggestions.concat(env.listAllProperties().map(scope.options.basePointer.suggest('Maybe you mean ', name)));


                            /*Object.keys(rule.data).map(child.pointer.suggest('It looks like you mean: ', definition.list[0].token.data))*/
                            scope.options.basePointer.error(
                                name+ ' is not property of '+ stackList.slice(0,stackList.length-1).join('.') +'<'+ env.getName() +'>',
                                node.loc.start,
                                suggestions,
                                scope.options.pipe ? 'pipe' : 'function'
                            );
                            return false;
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
                    if(lastEnv) {
                        if (lastEnv.getTag('anything')) {
                            env = this.world.Variant;
                        }
                    }else{
                        if(child.getTag('anything')){
                            env = this.world.Variant;
                            console.warn('Avoid implicit usage of <Variant> properties ('+name+')');
                            implicit = true;
                        }else {
                            throw new Error('Compiler does not know what is `' + name + '` and whos Property or Item it is')
                        }
                    }
                }

                if(env.getName() in tools.primitives){
                    if (context === false) {
                        context = i;
                        // we need to keep context
                        if (env.getName() === 'Function')
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
            return new VarInfo({fromWorldFlag: fromWorld, implicitFlag: implicit, selfFlag: selfFlag, varParts: out, context: context, used: obj});
        }
    };
    return tools;
})();