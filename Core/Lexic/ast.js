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
            [
                {type: 'COMMA', data: ','},
                {type: 'WORD', put: '*extend'}
            ]
        ]
    };
    var defineMatcher = function(child, store){
        
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
                
                defineMatcher(child, current);
                
            }
            tree = tree.children[0];
        }
        
        

        return ast;
    };

    return process;
})();