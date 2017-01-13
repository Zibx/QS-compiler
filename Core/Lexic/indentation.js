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
    // It is a hardcoded plain function for only one purpose
    // Fuck the beauty, it just do the job
    var process = function (tokens) {
        var i, _i, token, data, newLine = true, type, spaceCounter = 0,

            lineStart = 0, lines = [];

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
                if(newLine === false) {
                    lines.push({
                        pointer: tokens[lineStart].pointer,
                        tokens: tokens.slice(lineStart, i).map(getData).join('')
                    });
                }

                newLine = true;
                spaceCounter = 0;
                lineStart = i + 1;

            }

        }
        console.log(lines)
        return tokens;
    };
    return process;
})();