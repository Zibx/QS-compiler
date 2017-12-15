/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */;// Copyright by Ivan Kubota. 1/8/2017

module.exports = (function(){
    'use strict';

    var astRules = require('./astRules'),
        match = require('./astMatcher')(astRules),

        VariableExtractor = require('../JS/VariableExtractor'),

        Z = require('z-lib');

    var matchers = {
        func: require('./ext/function')(match, 'FUNCTION'),
        prop: require('./ext/property')(match, 'PROPERTY'),
        define: require('./ext/define')(match, ['DEFINE', 'DEFINE#']),
        metadata: require('./ext/metadata')(match, 'METADATA')
    };


    var AST_Define = function (cfg) {
        Z.apply(this, {
            public: {},
            private: {},
            events: {},
            tags: {},
            items: [],
            raw: [],
            unclassified: []
        });

        cfg && Z.applyBut(this, cfg, ['getValue']);
    };
    AST_Define.prototype = {
        _matchers: matchers,
        type: 'DEFINE',
        addTags: function (tags) {
            var _self = this;
            var addFn = function (item) {
                _self.add(_self.tags, i, item);
            };
            for(var i in tags){
                tags[i].forEach(addFn);
            }
            return this;
        },
        add: function (store, name, what, children) {
            if(!(name in store))
                store[name] = [];
            store[name].push(what);
            if(children)
                what.children = children;
            return this;
        },
        addTag: function (name, tag, children) {
            this.add(this.tags, name, tag, children);
            return this;
        },
        addEvent: function (name, evt, children) {
            this.add(this.events, name, evt, children);
            return this;
        },
        clear: function (name) {
            this[name] = {};
        },
        apply: function (cfg) {
            Z.apply(this, cfg);
            return this;
        },
        getTag: function(name){
            if(!this.tags || !this.tags[name])
                return false;

            var tag = this.tags[name];
            if(!tag[0])
                return false;
            if(Array.isArray(tag[0].value))
                return tag[0].value.map(function(item){return item.data;}).join('');
            else
                return tag[0].value;

        },
        getValue: function(){
            return this.value;
        },
        getName: function(){
            return this.name.getValue();
        }
    };

    var AST_Property = function (cfg) {
        AST_Define.call(this, cfg);
    };
    AST_Property.prototype = AST_Define.prototype;

    var AST_Event = function (cfg) {
        AST_Define.call(this, cfg);
    };
    AST_Event.prototype = AST_Define.prototype;

    var AST_Metadata = function (cfg) {
        AST_Define.call(this, cfg);
    };
    AST_Metadata.prototype = AST_Define.prototype;
    var isNotError = function(val){
        return val.isNotError();
    };
    var subMatcher = function(parent, storage){
        return function(item){
            var matched,
                isPublic,
                currentPropHolder, child, newItem;

            if(isNotError(matched = matchers.prop(item))){
                newItem = new AST_Property(matched);
                if(!parent|| !parent.items)
                    return;
                parent.items.push(newItem);

                isPublic = newItem.isPublic = matched.scope && matched.scope.mapped === 'public';

                if(matched.name) {

                    currentPropHolder = parent[isPublic?'public':'private'];
                    if(currentPropHolder[matched.name.data]){
                        throw new Error('prop already exists `'+matched.name.data+'`')
                    }else{
                        currentPropHolder[matched.name.data] = newItem;
                    }
                }else if(isPublic){
                    throw new Error('public property must be named');
                }else{

                }
            }else if(isNotError(matched = match('EVENT', item))){
                newItem = new AST_Event(matched);
                parent.addEvent(matched.name.data, newItem);
            }else if(isNotError(matched = match('METADATA', item))){
                // TODO: not parent, but next folowing prop

                storage.addTag(matched.name.getValue(), matched, item.children);
                storage.anyTags = true;
            }

            if(!isNotError(matched)){
                // RAW DATA. component may have custom syntax
                parent.unclassified.push(item);
            }else{
                if(newItem && storage.anyTags){
                    newItem.addTags(storage.tags);
                    storage.clear('tags');
                    storage.anyTags = false;
                }
                if(matched.value){
                    matchers.func({tokens: matched.value, matched: matched, item: item});
                    if(newItem)
                        newItem.value = matched.value;
                }
                if(newItem && item.children){
                    //child = new AST_Define(matched);
                    var tagStore = new AST_Define({tagStore: true});
                    item.children.forEach(subMatcher(newItem, tagStore));
                }
            }

            parent.raw.push(item);

        }
    };

    var process = function (tree, errorStorage) {
        var i, _i, children, child,
            ast = [], current, info,
            definition, inner, matched,
            tags = new AST_Define({tagStore: true});
        if(tree.type==='AST'){
            if(!tree.children.length){
                throw 'no defs'
            }
            children = tree.children;
            for( i = 0, _i = children.length; i < _i; i++ ){
                child = children[i];

                if(isNotError(definition = matchers.define(child))){
                    current = (new AST_Define(definition))
                        .addTags(tags.tags);

                    ast.push(current);
                    inner = child.children;

                    if(inner){
                        var tagStore = new AST_Define({tagStore: true});
                        inner.forEach(subMatcher(current, tagStore));
                    }

                    tags = new AST_Define({tagStore: true});
                }else if(isNotError(matched = matchers.metadata(child))){
                    tags.addTag(matched.name.data, matched, child.children);
                }else{
                    var rule = match.getRule(definition.list[0].rules[0]),
                        ruleText = rule.type +'('+ Object.keys(rule.data).join('|')+')';

                    errorStorage.push(child.pointer.error(
                        'can not match '+ ruleText +' in '+ definition.list[0].token.type +
                        '('+ definition.list[0].token.data+') ',

                        Object.keys(rule.data).map(child.pointer.suggest('It looks like you mean: ', definition.list[0].token.data))
                    ));

                    //throw new Error('can not match '+ruleText+' in '+ definition.list[0].token.type +'('+ definition.list[0].token.data+') ' +child.pointer)
                }
            }
            tree = tree.children[0];
        }



        return ast;
    };
    process.matchers = matchers;
    process.AST_Define = AST_Define;
    return process;
})();