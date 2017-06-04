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

    var clean = function( item ){
        delete item.parent;
        delete item.first;
        item.items && item.items.map(clean);
    };

    // It is a hardcoded plain function for only one purpose
    // Fuck the beauty, it just do the job
    var process = function (tokens) {
        var i, _i, token, data, newLine = true, type, spaceCounter = 0,

            lineStart = 0, lines = [];
        tokens = tokens.filter(function(token){
            return token.type !== 'NEWLINE' || token.data !== '\r';
        });

        for (i = 0, _i = tokens.length; i < _i; i++) {
            token = tokens[i];

            data = token.data;
            type = token.type;

            if(newLine){
                if(type==='SPACE') {
                    //spaceCounter += data === '\t' ? 4 : 1;
                }else if(type === 'Comment'){
                    // skip comment in indentation
                }else if(type !== 'NEWLINE'){ // NEWLINE happens only when the whole line was empty
                    //console.log(token)
                    //console.log(spaceCounter, token.pointer.col-1);
                    spaceCounter = token.pointer.col-1;
                    newLine = false;
                    lineStart = i;
                }
            }

            if(type==='NEWLINE') {
                if(data === '\r')continue;
                if(newLine === false) {
                    lines.push({
                        type: 'Line',
                        pointer: tokens[lineStart].pointer,
                        tokens: tokens.slice(lineStart, i)//.map(getData).join('')
                    });
                }

                newLine = true;
                spaceCounter = 0;
                lineStart = i + 1;

            }

        }
        
        if(newLine === false) {
            lines.push({
                type: 'Line',
                pointer: tokens[lineStart].pointer,
                tokens: tokens.slice(lineStart, i)//.map(getData).join('')
            });
        }

        var line,
            padding, lastPadding = 0, j,
            root = {tokens: [], pointer:lines[0].pointer, type: 'AST', children: []},
            stack = [root], head = root, col;

        for( i = 0, _i = lines.length; i < _i; i++ ){
            line = lines[i];
            col = line.pointer.col;
            if (col !== void 0) {
                padding = col;

                /** searching for parent by itterating over stack.
                 * stops when parent indent is less than current line indent */

                if(padding <= lastPadding) {
                    for(j = stack.length - 1; j;)
                        if((head = stack[--j]).pointer.col < padding)
                            break;

                    stack.length = j + 1;
                    head = stack[j];
                }

                /** clean circular links. we do not need them any more */
                clean(line);

                (head.children || (head.children = [])).push(line);
                stack.push(line);
                head = line;

                lastPadding = padding;
            }
        }

        return root;
    };
    return process;
})();