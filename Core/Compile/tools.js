/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 4/25/17.

module.exports = (function () {
    'use strict';
    var tools = {
        primitives: {
            'Number': true, 'String': true, 'Array': true, 'Boolean': true, 'Function': true
        },
        getVarInfo: function (stack, obj, child) {

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
                        env = child;
                        thisFlag = true;
                    } else {
                        if(metadata === void 0)
                            debugger;
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
                            throw new Error(
                                'Unknown variable `' + name + '` in `' + obj.name + '` at '+(child && child.pointer || somePointer)
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
                    metadata = this.world[(env.class && env.class.data) || env.type]
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