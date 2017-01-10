/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// Copyright by Ivan Kubota. 1/8/2017
module.exports = (function () {
    'use strict';
    var Tokens = require('./Tokens');
    var Iterator = require('./Iterator');
    var lineSplitter = function (tokens) {
        var lines = new Tokens.Body(),
            line = new Tokens.Line(),
            i, _i, token;

        for( i = 0, _i = tokens.length; i < _i; i++ ){
            token = tokens[i];
            if(token.data === '\n'){
                lines.push(line);
                line = new Tokens.Line();
            }else{
                line.push(token);
            }
        }
        lines.push(line);
        return lines;
    },
        quotesAndLongComments = require('./Lexic/quotesAndLongComments'),
        shortCommentsAndURLs  = require('./Lexic/shortCommentsAndURLs'),
        braces  = require('./Lexic/braces'),
        indentation  = require('./Lexic/indentation');
    var lexer = function (tokens) {

        //var AST = lineSplitter(tokens);
        tokens = quotesAndLongComments(tokens);
        tokens = shortCommentsAndURLs(tokens);
        tokens = braces(tokens);
        tokens = indentation(tokens);

        console.log(tokens)

    };
    return lexer;
})();