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

    var matchers = {
        DEFINE: [
            {type: 'WORD', data: 'def'},
            {type: 'WORD', put: 'name'},
            {type: 'WORD', put: '*extend'},
            {type: 'maybe', data: [
                {type: 'COMMA', data: ','},
                {type: 'WORD', put: '*extend'}
            ]}
        ]
    };
    var match = function(type, child, store){
        var out = {},
            should = matchers[type],

            i, _i, tokens = child.tokens, token,
            //rule, rulePointer = 0,
            rules = [{list: should, pointer: 0}], rule,
            suit,
            putKey, multiple;

        if(!should)
            throw new Error('Unknown matcher');

        //rule = should[rulePointer];

        for( i = 0, _i = tokens.length; i < _i; i++ ){
            token = tokens[i];



            if(token.type !== 'SPACE'){

                while(true){

                    suit = true;
                    if ('type' in rule)
                        if (token.type !== rule.type)
                            suit = false;

                    if ('data' in rule)
                        if (token.data !== rule.data)
                            suit = false;

                    if (!suit)
                        throw new Error('Not a costume', token, rule);

                    break;
                }

                if('put' in rule){

                    putKey = rule.put;
                    multiple = putKey[0] === '*';

                    if(multiple) {
                        putKey = putKey.substr(1);
                        out[putKey] || (out[putKey] = []);
                        out[putKey].push(token)
                    }else{
                        out[putKey] = token;
                    }
                }
                rulePointer++;
                rule = should[rulePointer];

            }

        }


    };

    // It is a hardcoded plain function for only one purpose
    // Fuck the beauty, it just do the job
    var process = function (tree) {
        var i, _i, children, child,
            ast = [], current;
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
                
                match('DEFINE', child, current);
                
            }
            tree = tree.children[0];
        }
        
        

        return ast;
    };

    return process;
})();