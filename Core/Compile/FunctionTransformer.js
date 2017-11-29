/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 4/25/17.

module.exports = (function () {
    'use strict';
    //buildPipe.call(this, item.item.value, obj, whos, sm);
    var VariableExtractor = require('../JS/VariableExtractor'),
        ASTtransformer = require('../JS/ASTtransformer'),
        tools = require('./tools');


    var getName = function (el) {
        return el.name;
    };
    var transformer = {
        functionTransform: function (fnObj, cls, child) {
            var meta = cls.metadata;
            var _self = this;
            var transformFnGet =
                function (node, stack, scope, parent) {
                    var c0 = cls;
                    var list = stack.slice().reverse(),
                        varParts;
                    var skipFirst = false,
                        skipValue = false;
                    var info = tools.getVarInfo.call(_self, list, cls, child, scope);
                    if(!info) {
                        return false;
                        throw new Error('Can not resolve '+
                            list.map(function(token){return token.name}).join('.') +
                            ' at (' + fnObj.fn.pointer+')')
                    }
                    var firstToken = info.varParts[0],
                        who;

                    if(info.thisFlag){
                        info.varParts[0].name = info.varParts[0].e;
                        if(info.varParts[0].name.name)
                            info.varParts[0].name = info.varParts[0].name.name;
                        info.varParts[0].node.computed = true;
                    }
                    var what = cls.subItems[info.varParts[0].name];

                    if (
                        (
                            (what === void 0 && info.selfFlag) ||
                            (what !== void 0 && what.isPublic)
                        ) && !info.fromWorldFlag
                    ) {
                        who = ASTtransformer.craft.Identifier('_self');
                        if(!info.implicitFlag){
                            skipFirst = true;
                        }
                    } else {
                        if(what === void 0) {
                            who = ASTtransformer.craft.Identifier(firstToken.name);
                            _self.addDependency(cls, firstToken.name);
                            // TODO: add dependency firstToken.class

                            skipFirst = true;
                            skipValue = true;
                        }else{
                            who = ASTtransformer.craft.Identifier('__private');
                        }
                    }
                    /*
                        info.context--;
                        info.varParts.shift();

                        who = ASTtransformer.craft.Identifier(firstToken.name);
                    }*/

                    var beforeContext = [], afterContext = [], i, _i, item,
                        varItem;
                    varParts = info.varParts;

                    // need to keep context
                    if (info.context === false)
                        info.context = info.varParts.length - 1;

                    for (i = skipFirst ? 1 : 0, _i = varParts.length; i < _i; i++) {

                        item = varParts[i];
                        if(i===0 && info.selfFlag)
                            if(item.node.computed === false)
                                continue;
                        if (item.node.computed) {
                            varItem = scope.doTransform.call(scope.me, item.node, scope.options);
                        } else {
                            varItem = {
                                'type': 'Literal',
                                'value': item.name,
                                'raw': '\'' + item.name + '\''
                            };
                            if ('_id' in item)
                                varItem._id = item._id;
                        }

                        if (i <= info.context)
                            beforeContext.push(varItem);
                        else
                            afterContext.push(item.node);
                    }

                    var c = ASTtransformer.craft, // craft short link
                        out;//
                    if (info.valueFlag && !skipValue)
                        if (!afterContext.length) {
                            beforeContext.push(c.Literal('value'));
                        } else {
                            afterContext.push(c.Literal('value')); // TODO
                        }

                    if (beforeContext.length)
                        out = c.CallExpression(who, 'get', beforeContext);
                    else
                        out = who;

                    /*if (info.valueFlag)
                     afterContext.push(c.Literal('value')); // TODO*/

                    for (i = 0, _i = afterContext.length; i < _i; i++)
                        out = c.MemberExpression(out, afterContext[i]);

                    return out;

                },
                transformFnSet = function (node, stack, scope) {
                    var c0 = cls, i, _i;
                    var list = stack.slice().reverse(),
                        varParts,

                        info = tools.getVarInfo.call(_self, list, cls, child, scope);
                    if(!info) {
                        return false;
                        throw new Error('Can not resolve '+
                            list.map(function(token){return token.name}).join('.') +
                            ' at (' + fnObj.fn.pointer+')')
                    }
                    var firstToken = info.varParts[0],
                        who;

                    //    first = list[0];
                    // var env = tools.isNameOfEnv(first.name, meta),
                    //     who;

                    var skipFirst = false,
                        skipValue = false;

                    if(info.thisFlag){
                        info.varParts[0].name = info.varParts[0].e;
                        if(info.varParts[0].name.name)
                            info.varParts[0].name = info.varParts[0].name.name;
                        info.varParts[0].node.computed = true;

                    }
                    /*if(info.thisFlag){
                        info.varParts[0].name = info.varParts[0].e;
                        info.varParts[0].node.computed = true;
                    }*/

                    var what = cls.subItems[info.varParts[0].name];
                    if ((what === void 0 && info.selfFlag) || (what !== void 0 && what.isPublic)) {
                        who = ASTtransformer.craft.Identifier('_self');

                        if(!info.implicitFlag){
                            skipFirst = true;
                        }
                    }else {
                        if(what === void 0) {
                            who = ASTtransformer.craft.Identifier(firstToken.name);
                            skipFirst = true;
                            skipValue = true;
                        }else {
                            if (what.isPublic) {
                                who = ASTtransformer.craft.Identifier('_self');
                            } else {
                                who = ASTtransformer.craft.Identifier('__private');
                            }
                        }
                    }



                    /*if (info.self) {
                        who = ASTtransformer.craft.Identifier('self');
                    } else {
                        info.context--;
                        info.varParts.shift();
                        who = info.thisFlag ? ASTtransformer.craft.This() : ASTtransformer.craft.Identifier(firstToken.name);
                    }*/
                    if (info.valueFlag)
                        info.varParts.push({name: 'value'});

                    var val = scope.doTransform.call(scope.me, node.right, scope.options);
                    var argumentsList = [],
                        varItem;

                    varParts = info.varParts;

                    for (i = skipFirst ? 1 : 0, _i = varParts.length; i < _i; i++) {
                        var item = varParts[i]
                        if(i===0 && info.selfFlag){
                            if(item.node.computed === false) {
                                continue;
                            }
                        }

                        if (item.node && item.node.computed) {
                            varItem = scope.doTransform.call(scope.me, item.node, scope.options);
                        } else {
                            var varItem = {
                                'type': 'Literal',
                                'value': item.name,
                                'raw': '\'' + item.name + '\''
                            };
                            if ('_id' in item)
                                varItem._id = item._id;

                        }
                        argumentsList.push(varItem);
                    }



                    return {
                        'type': 'CallExpression',
                        'callee': {
                            'type': 'MemberExpression',
                            'computed': false,
                            'object': who,
                            'property': {
                                'type': 'Identifier',
                                'name': 'set'
                            }
                        },
                        'arguments': [
                            {
                                'type': 'ArrayExpression',
                                'elements': argumentsList
                            },
                            val
                        ]

                    };

                },
                options = {
                    variableTransformerSet: transformFnSet,
                    variableTransformerGet: transformFnGet,
                    basePointer: fnObj.fn.pointer
                },
                transformer = new ASTtransformer(),
                fn = fnObj.fn;

            fn = transformer.transform(fn.ast, fn.vars, options);
            return 'function(' + fnObj.args.map(getName).join(',') + '){\n' + fn + '\n}';
        }
    };
    var functionTransformer = function(item, obj, whos, sm){
        var body = transformer.functionTransform.call(this, {fn: item.value.body, args: item.value.arguments}, obj, whos)
        return body;
        
    };
    var FunctionTransformer = function(fn, cls, instance, compiler){
        this.fn = fn;
        this.cls = cls;
        this.instance = instance;
        this.compiler = compiler;

    };
    FunctionTransformer.prototype = {
        transform: function(){
            var fn = this.fn;
            var body = transformer.functionTransform.call(
                this.compiler, {fn: fn.value.body, args: fn.value.arguments}, this.cls, this.instance);
            return body;
        }
    };
    return FunctionTransformer;//FunctionTransformer;//functionTransformer;
})();