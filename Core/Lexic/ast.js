/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */;// Copyright by Ivan Kubota. 1/8/2017

module.exports = (function(){
    'use strict';
    var getData = function(item){
        return item.data;
    };
    var quotes = {'\'': 1, '"': 1};
    var a2o = function(arr){
        return arr.reduce(function(store, item){
            store[item] = true;
            return store;
        }, {});
    };
    var matchers = {
        DEFINE: [
            {type: 'WORD', data: ['def', 'define', 'class']},
            {type: 'WORD', put: 'name'},
            {type: 'WORD', put: '*extend'},
            {type: '*', count: 'any', items: [
                {type: 'COMMA', data: ','},
                {type: 'WORD', put: '*extend'}
            ]}
        ],
        'DEFINE#': [
            {type: 'WORD', data: ['def', 'define', 'class']},
            {type: 'WORD', put: 'name'},
            {type: 'SEMICOLON', data: ':'},
            {type: 'WORD', put: '*extend'},
            {type: '*', items: [
                {type: 'COMMA', data: ','},
                {type: 'WORD', put: '*extend'}
            ]}
        ],
        'property': [
            //{type: '*', items: [
                {type: 'WORD', data: ['pub', 'public']},
            //]},
            {type: 'WORD', put: 'type'},
            {type: 'WORD', put: 'name'},
            {type: '*', items: [
                {type: 'SEMICOLON', data: ':'},
                {type: 'ALL', put: 'value'}
            ]}
        ],
        'event': [
            //{type: '*', items: [
            {type: 'DOT'},
            {type: 'WORD', put: 'name'},
            {type: '*', items: [
                {type: 'SEMICOLON', data: ':'},
                {type: 'ALL', put: 'value'}
            ]}
        ],
    };
    var nextRuleCursor = function(ruleHolder, store){
        var i, _i,

            pointer = ruleHolder.pointer,
            node = ruleHolder,
            dimensions = [], dimensionsHolders = [],
            possibility, rule, newRule;

        for( i = 0, _i = pointer.length; i < _i; i++ ){
            dimensionsHolders.push(node);
            if( node instanceof Array ){
                dimensions.push(node.length);
                node = node[pointer[i]];
            }else{

                dimensions.push(node.items.length);
                node = node.items[pointer[i]];
            }
        }

        for( i = dimensions.length; i;){
            --i;
            if(dimensions[i] - 1 > pointer[i]){
                // GOTCHA
                possibility = pointer.slice(0,i).concat(pointer[i] + 1);
                break;
            }else if(dimensionsHolders[i].type === '*'){
                store.push({
                    items: ruleHolder.items,
                    pointer: pointer.slice(0,i).concat(0),
                    store: Object.create(ruleHolder.store)
                });
            }
        }



        if(possibility) {
            newRule = {
                items: ruleHolder.items,
                pointer: possibility,
                store: Object.create(ruleHolder.store)
            };
            rule = getRule(newRule);

            if (rule.type === '*') {
                // step over
                nextRuleCursor(newRule, store);

                //get into
                possibility.push(0);
                store.push(newRule)
            } else {
                store.push(newRule)
            }
        }else{

            store.push({type: 'END', store: ruleHolder.store})
        }
        /*
        debugger;


        var newRule = {items: ruleHolder.items, pointer: ruleHolder.pointer.slice(), store: Object.create(store)};

        newRule.pointer[newRule.pointer.length-1] = newRule.pointer[newRule.pointer.length-1] + 1;
        rule = getRule(ruleHolder);
        if(rule.type === '*'){
            newRule.pointer.push(0);
        }


        store.push(newRule)
        */
    };
    var getRule = function(ruleHolder){
        return ruleHolder.pointer.reduce(function(items, a){
            return items instanceof Array ? items[a] : items.items[a];
        }, ruleHolder.items);
    };
    var match = function(type, child){
        var should = matchers[type],

            i, _i, tokens = child.tokens, token,
            //rule, rulePointer = 0,
            rules = [{items: should, pointer: [0], store: {}}],
            rule, ruleHolder, nextRules,
            j,
            suit,
            putKey, multiple, store;

        if(!should)
            throw new Error('Unknown matcher');

        //rule = should[rulePointer];

        for( i = 0, _i = tokens.length; i < _i; i++ ){
            token = tokens[i];

            if(token.type !== 'SPACE'){
                nextRules = [];
                if(!rules.length)
                    return false;

                for(j = rules.length; j;){
                    ruleHolder = rules[--j];

                    if(ruleHolder.type === 'END')
                        continue;

                    rule = getRule(ruleHolder);
                    suit = true;

                    store = ruleHolder.store;

                    if ('type' in rule)
                        if (token.type !== rule.type)
                            suit = false;

                    if ('data' in rule) {
                        if(typeof rule.data === 'string') {
                            if (token.data !== rule.data)
                                suit = false;
                        }else{
                            if(rule.data instanceof Array) {
                                rule.data = a2o(rule.data);
                            }
                            if(!(token.data in rule.data))
                                suit = false;
                        }
                    }

                    if (suit){
                        nextRuleCursor(ruleHolder, nextRules);

                        if('put' in rule){

                            putKey = rule.put;
                            multiple = putKey[0] === '*';

                            if(multiple) {
                                putKey = putKey.substr(1);
                                store[putKey] || (store[putKey] = []);
                                store[putKey].push(token)
                            }else{
                                store[putKey] = token;
                            }
                        }
                    }/*else{
                        console.log('NO', rule, token)
                    }*/
                }
                rules = nextRules;
            }

        }
        if(rules.length) {
            var out = rules.filter(function(rule){
                return rule.type === 'END';
            }).map(function(item){
                var out = {},
                    store = item.store, i;
                for( i in store ){
                    out[i] = store[i];
                }
                return out;
            });
            if(out.length)
                return out[0];
        }else
            return false;

    };

    // It is a hardcoded plain function for only one purpose
    // Fuck the beauty, it just do the job
    var process = function (tree) {
        var i, _i, children, child,
            ast = [], current, info;
        if(tree.type==='AST'){
            if(!tree.children.length){
                throw 'no defs'
            }
            children = tree.children;
            for( i = 0, _i = children.length; i < _i; i++ ){                
                child = children[i];
                // should be define

                current = {type: 'DEFINE'};
                ast.push(current);

                info = match('DEFINE', child, current) || match('DEFINE#', child, current);
                console.log(info)
            }
            tree = tree.children[0];
        }
        
        

        return ast;
    };
console.log(new Date())
    return process;
})();