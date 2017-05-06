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
        match = require('./astMatcher')(matchers),
        tTools = require('../tokenTools'),
        VariableExtractor = require('../JS/VariableExtractor');

    var UNKNOWN_ARGUMENT_TYPE = 'Variant',
        EMPTY_RETURN_VALUE = 'void';
    var bodyParser = function(body){
        var vars = {},
            parsed;
        try {
            parsed = VariableExtractor.parse(body.data);
            body.ast = parsed.getAST();
            vars = parsed.getFullUnDefined();
        }catch(e){
            body.pointer.error(e.description, {
                col: e.column,
                row: e.lineNumber - 1 + body.pointer.row
            });
        }
        body.vars = vars;

    };

    var subMatcher = function(parent, storage){
        return function(item){
            var matched,
                isPublic,
                currentPropHolder;
            if(matched = match('PROPERTY', item)){

                parent.items.push(matched);
                isPublic = matched.scope && {public: true, pub: true}[matched.scope.data];

                /*if(matched.class && !matched.name){
                    matched.name = matched.class;
                    matched.class = void 0;
                }
                console.log({name: matched.name && matched.name.data, class: matched.class && matched.class.data})*/
                if(matched.name) {

                    currentPropHolder = parent[isPublic ? 'public' : 'private'];
                    if(currentPropHolder[matched.name.data]){
                        throw new Error('prop already exists `'+matched.name.data+'`')
                    }else{
                        currentPropHolder[matched.name.data] = matched;
                    }
                }else if(isPublic){
                    throw new Error('public property must be named');
                }else{

                }
            }else if(matched = match('EVENT', item)){
                (parent.events[matched.name.data] ||
                (parent.events[matched.name.data] = []))
                    .push(matched);
            }else if(matched = match('METADATA', item)){
                // TODO: not parent, but next folowing prop

                (storage.tags[matched.name.data] ||
                (storage.tags[matched.name.data] = []))
                    .push(matched);
                storage.anyTags = true;
            }

            if(!matched){
                // RAW DATA. component may have custom syntax
                parent.unclassified.push(item);
            }else{
                if(matched._matchType !== 'METADATA' && storage.anyTags){
                    Object.assign(matched.tags = {}, storage.tags);

                    storage.tags = {};
                    storage.anyTags = false;
                }
                /*if(matched.cls){
                    debugger
                }*/
                if(matched.value){
                    var fn = match('FUNCTION', {tokens: matched.value});
                    if(fn) {
                        // yep, it's function!
                        var fnBody = fn.body;
                        //console.log(fnBody[0])
                        if (fnBody && fnBody.tokens && fnBody.tokens.length && fnBody.type === 'Brace' && fnBody.info === '{') {
                            // braced function body
                            var bodyTokens = fnBody.tokens;
                            bodyTokens = bodyTokens.slice(1, bodyTokens.length - 1);
                        } else {
                            bodyTokens = fnBody;
                        }
                        bodyTokens = bodyTokens || [];

                        if(item.children)
                            bodyTokens = bodyTokens.concat(item.children);

                        console.log(fn.returnType);
                        matched.value = {
                            type: 'FUNCTION',
                            arguments: fn.arguments.tokens.length < 3 ? [] : tTools.split(
                                fn.arguments.tokens.slice(1,fn.arguments.tokens.length-1), {type: 'COMMA'}
                            ).map(tTools.trim),
                            body: tTools.toString(bodyTokens)
                        };

                        /** TODO check for return in js ast. DIRTY HACK*/
                        if(fn.returnType){
                            matched.value.returnType = fn.returnType.data
                        }else{
                            matched.value.returnType = matched.value.body.data.indexOf('return')>-1 ?
                                UNKNOWN_ARGUMENT_TYPE
                                : EMPTY_RETURN_VALUE;
                        }

                        /** END OF DIRTY HACK */

                        bodyParser(matched.value.body);

                        matched.value['arguments'] = matched.value['arguments'].map(function(item){
                            // argument info extraction

                            var argType = item.length>1?
                                tTools.trim(item.slice(0, item.length - 1))
                                    .map(function(item){return item.data;})
                                    .join('')
                                :UNKNOWN_ARGUMENT_TYPE,
                                name = item[item.length - 1].data;
                            delete matched.value.body.vars[name];

                            return {
                                name: name,
                                type: argType,
                                pointer: item[0].pointer};
                        });


                        //console.log(matched.value.arguments[0]);
                    }

                }
                if(item.children){
                    Object.assign(matched, {
                        type: 'DEFINE',
                        public: {},
                        private: {},
                        events: {},
                        tags: {},
                        items: [],
                        raw: [],
                        unclassified: []
                    });
                    item.children.forEach(subMatcher(matched, {tags: {}}));
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
            definition, inner, matched, tags = {};
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
                        tags: tags,
                        items: [],
                        raw: [],
                        unclassified: []
                    }, definition);
                    ast.push(current);
                    inner = child.children;
                    inner && inner.forEach(subMatcher(current, {tags: {}}));

                    //console.log(current)
                    //console.log('----')
                    tags = {};
                }else if(matched = match('METADATA', child)){
                    (tags[matched.name.data] ||
                    (tags[matched.name.data] = []))
                        .push(matched);
                    if(child.children)
                        matched.children = child.children;
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