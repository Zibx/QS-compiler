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

    var matchers = require('./astRules'),
        match = require('./astMatcher')(matchers);
    
    var subMatcher = function(parent){
        return function(item){
            var matched,
                isPublic,
                currentPropHolder;
            if(matched = match('PROPERTY', item)){
                parent.items.push(matched);
                isPublic = matched.scope && {public: true, pub: true}[matched.scope.data];
                if(matched.name) {
                    currentPropHolder = parent[isPublic ? 'public' : 'private'];
                    if(currentPropHolder[matched.name.data]){
                        throw new Error('prop already exists `'+matched.name.data+'`')
                    }else{
                        currentPropHolder[matched.name.data] = matched;
                    }
                }else if(isPublic){
                    throw new Error('public property must be named');
                }
            }else if(matched = match('EVENT', item)){
                (parent.events[matched.name.data] ||
                (parent.events[matched.name.data] = []))
                    .push(matched);
            }else if(matched = match('METADATA', item)){
                (parent.metadata[matched.name.data] ||
                (parent.metadata[matched.name.data] = []))
                    .push(matched);
            }

            if(!matched){
                // RAW DATA. component may have custom syntax
                parent.unclassified.push(item);
            }else{
                if(matched.value){
                    var fn = match('FUNCTION', {tokens: matched.value});

                    var fnBody = fn.body;
                    //console.log(fnBody[0])
                    if(fnBody && fnBody.length && fnBody[0] && fnBody[0].type === 'Brace' && fnBody[0].info === '{'){
                        // braced function body
                        var bodyTokens = fnBody[0].tokens;
                        bodyTokens = bodyTokens.slice(1,bodyTokens.length-1);
                        console.log(bodyTokens);
                    }else{


                    }

                    item.children
                }
                if(item.children){
                    Object.assign(matched, {
                        type: 'DEFINE',
                        public: {},
                        private: {},
                        events: {},
                        metadata: {},
                        items: [],
                        raw: [],
                        unclassified: []
                    });
                    item.children.forEach(subMatcher(matched));
                }
            }

            parent.raw.push(item);

        }
    };
    // It is a hardcoded plain function for only one purpose
    // Fuck the beauty, it just do the job
    var process = function (tree) {
        var i, _i, children, child,
            ast = [], current, info,
            definition, inner;
        if(tree.type==='AST'){
            if(!tree.children.length){
                throw 'no defs'
            }
            children = tree.children;
            for( i = 0, _i = children.length; i < _i; i++ ){                
                child = children[i];
                // should be define

                definition = match('DEFINE', child) || match('DEFINE#', child);
                if(definition){
                    current = Object.assign({
                        type: 'DEFINE',
                        public: {},
                        private: {},
                        events: {},
                        metadata: {},
                        items: [],
                        raw: [],
                        unclassified: []
                    }, definition);
                    ast.push(current);
                    inner = child.children;
                    inner && inner.forEach(subMatcher(current));

                    //console.log(current)
                    //console.log('----')

                }else{
                    throw new Error('ololo')
                }
                //console.log(info)
            }
            tree = tree.children[0];
        }
        
        

        return ast;
    };

    return process;
})();