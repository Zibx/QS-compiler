/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// Copyright by Ivan Kubota. 1/8/2017
module.exports = (function () {
    'use strict';
    var Tokens = require('./Tokens'),
        quotesAndLongComments = require('./Lexic/quotesAndLongComments'),
        shortCommentsAndURLs  = require('./Lexic/shortCommentsAndURLs'),
        braces  = require('./Lexic/braces'),
        indentation  = require('./Lexic/indentation'),
        ast = require('./Lexic/ast');

    var preprocess = function (tokens, noAST, errorStorage) {

            errorStorage = errorStorage || [];

            //var AST = lineSplitter(tokens);
            tokens = quotesAndLongComments(tokens);//* +
            tokens = shortCommentsAndURLs(tokens);

            /*console.log(tokens.filter(function(item){
                return item.type==='URI'
            }).map(getData2));*/

            tokens = braces(tokens);
            tokens = indentation(tokens);

            if(!noAST)
                tokens = ast(tokens, errorStorage);

            return tokens;

        };

    preprocess.quotesAndLongComments = quotesAndLongComments;
    preprocess.shortCommentsAndURLs = shortCommentsAndURLs;
    preprocess.braces = braces;
    preprocess.indentation = indentation;
    preprocess.ast = ast;

    return preprocess;
})();