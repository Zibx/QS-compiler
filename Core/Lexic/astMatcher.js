/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 1/27/17.

module.exports = function (matchers) {
    'use strict';
    var a2o = function(arr){
        return arr.reduce(function(store, item){
            store[item] = true;
            return store;
        }, {});
    };
    var nextRuleCursor = function(ruleHolder, store){
        var i, _i, j,

            pointer = ruleHolder.pointer,
            node = ruleHolder,
            dimensions = [], dimensionsHolders = [],
            possibility, rule, newRule;

        for( i = 0, _i = pointer.length; i < _i; i++ ){
            dimensionsHolders.push(node);
            if( node instanceof Array ){
                dimensions.push(node.length);
                node = node[pointer[i].value];
            }else{

                dimensions.push(node.items.length);
                node = node.items[pointer[i].value];
            }
        }

        for( i = dimensions.length; i;){
            --i;
            if(dimensions[i] - 1 > pointer[i].value || (dimensions[i] > pointer[i].value && pointer[i].pick === true)){
                // GOTCHA
                if(!pointer[i].pick && pointer[i].stop)continue;
                possibility = pointer.slice(0,i).concat({value: pointer[i].value + (pointer[i].pick?0:1), stop: pointer[i].stop});
                break;
            }else if(dimensionsHolders[i].type === '*'){
                store.push({
                    items: ruleHolder.items,
                    pointer: pointer.slice(0,i).concat({value: 0}),
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

            if (rule.type === '*' || rule.type === '?') {
                // step over
                nextRuleCursor(newRule, store);

                //get into
                possibility.push({value:0, pick: true});
                if(newRule.type === 'OR')debugger;
                nextRuleCursor(newRule, store);
            } else if (rule.type === 'OR') {
                for( i = rule.items.length; i;){

                    --i;
                    if(rule.items[i] instanceof Array){
                        nextRuleCursor(
                            Object.assign(
                                {},
                                newRule,
                                {pointer: possibility.slice().concat({value: i, stop: true},{value: 0, pick: true})}
                            ), store);
                    }else {
                        nextRuleCursor(Object.assign({}, newRule, {pointer: possibility.slice().concat({value: i, pick: true, stop: true})}), store);
                    }
                }


            }else{
                if(newRule.type === 'OR')debugger;
                store.push(newRule)
            }
        }else{
            store.push({type: 'END', store: ruleHolder.store, pointer: []})
        }
    };
    var getRule = function(ruleHolder){
        return ruleHolder.pointer.reduce(function(items, a){
            return items instanceof Array ? items[a.value] : items.items[a.value];
        }, ruleHolder.items);
    };
    var MatchError = function(rules, token){
        this.rules = rules;
        this.token = token;
    };
    MatchError.prototype = {
        isNotError: function(){
            return false;
        }
    };

    var MatchErrors = function(list){
        this.list = list;
    };
    MatchErrors.prototype = {
        isNotError: function(){
            return false;
        }
    };
    MatchErrors.prototype.__proto__ = Array.prototype;



    var match = function(type, child, debug){
        var should = matchers[type],

            i, _i, tokens = child.tokens, token, lastToken,
        //rule, rulePointer = 0,
            rules = [],//[{items: should, pointer: [0], store: {}}],
            rule, ruleHolder, nextRules,
            lastRules,
            j,
            suit,
            putKey, multiple, store, whatever = false;

        // if first rule is complex - we need to get into it,
        // so I add invisible first rule 'START' and use mechanics
        // of normal rule iterating
        nextRuleCursor({items: [{type: 'START'}].concat(should), pointer: [{value:0}], store: {}}, rules);

        if(debug) {
            console.log('--- STEP ---');
            var list = rules.map(function (item) {
                return getRule(item);
            });
            console.log(list)
        }

        if(!should)
            throw new Error('Unknown matcher');

        //rule = should[rulePointer];

        for( i = 0, _i = tokens.length; i < _i; i++ ){
            token = tokens[i];

            if(token.type !== 'SPACE'){
                if(debug){
                    console.log('TOKEN: '+JSON.stringify({type: token.type, data: token.data, info: token.info})+'')
                }
                nextRules = [];
                if(!rules.length)
                    return new MatchError(lastRules, lastToken);

                for(j = rules.length; j;){
                    ruleHolder = rules[--j];

                    if(ruleHolder.type === 'END')
                        continue;

                    rule = getRule(ruleHolder);

                    whatever = false;
                    suit = true;

                    store = ruleHolder.store;

                    if ('type' in rule) {
                        if(rule.type === 'ALL')
                            whatever = true;

                        if (token.type !== rule.type)
                            suit = false;
                    }

                    if ('info' in rule) {
                        if (token.info !== rule.info)
                            suit = false;
                    }

                    if ('data' in rule) {
                        if(typeof rule.data === 'string') {
                            if (token.data !== rule.data)
                                suit = false;
                        }else{
                            if(rule.data instanceof Array) {
                                rule.data = a2o(rule.data);
                            }
                            if(!(token.data in rule.data)) {
                                suit = false;
                            }else{
                                token.mapped = rule.data[token.data];
                            }
                        }
                    }
                    if ('notData' in rule) {
                        if(typeof rule.notData === 'string') {
                            if (token.data === rule.notData)
                                suit = false;
                        }else{
                            if(rule.notData instanceof Array) {
                                rule.notData = a2o(rule.notData);
                            }
                            if((token.data in rule.notData))
                                suit = false;
                        }
                    }
                    if(whatever){
                        if('put' in rule){

                            putKey = rule.put;

                            store[putKey] = tokens.slice(i);
                            nextRules = [{type: 'END', store: store, pointer: []}];
                        }
                        break;
                    }
                    if (suit ){
                        //if(token.data === '>')debugger;
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

                    }else{
                        //console.log('NO', rule, token)
                    }
                }
                lastRules = rules;
                lastToken = token;
                rules = nextRules;
                if(debug) {
                    console.log('--- STEP ---');
                    var list = rules.map(function (item) {
                        return getRule(item);
                    });
                    console.log(list)

                }
                if(whatever)
                    break;
            }

        }
        if(rules.length) {
            var out = rules.filter(function(rule){
                return rule.type === 'END';
            });
            
            /*if(out.length>1)
                debugger;
*/
            out = out.map(function(item){
                var out = {},
                    store = item.store, i;
                for( i in store ){
                    out[i] = new Match(i, store[i]);
                }
                out._matchType = type;
                return out;
            });

            if(out.length)
                return new Match(type, out[0]);
            else
                return new MatchError(lastRules, lastToken);
        }else
            return new MatchError(lastRules, lastToken);

    };
    match.MatchError = MatchError;
    match.MatchErrors = MatchErrors;
    match.getRule = getRule;
    var MatchCollection = function(name, data){
        return data;
        this._name = name;
        this.splice.apply(this, [0,0].concat(data));
    };
    MatchCollection.prototype = new Array();

    var Match = function(name, data){
        if(Array.isArray(data))
            return new MatchCollection(name, data);
        this._name = name;
        Object.assign(this, data);

    };
    Match.prototype = {
        getValue: function(){
            return this.data;
        },
        isNotError: function(){
            return true;
        }
    };
    return match;
};