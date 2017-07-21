/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2016
// By zibx on 12/22/16.

module.exports = (function () {
    'use strict';
    var AbstractPointerFactory = require('../Types/AbstractPointerFactory');

    var tokens = {
        ':': 'SEMICOLON',
        '()': 'BRACE',
        '[]': 'SQUARE_BRACE',
        '{}': 'CURVED_BRACE',
        '@': 'DOG',
        '!+-*/^%|&~': 'OPERATION',
        '><=': 'COMPARE',
        '\n\r': 'NEWLINE',
        '\t': 'SPACE',
        ' ': 'SPACE',
        '"\'': 'QUOTE',
        '\\': 'ESCAPE',
        '.': 'DOT',
        ',': 'COMMA',
        '?': 'QUESTION',
        '#$;': 'SPECIAL'
    };
    for(var i in tokens){
        if(i.length > 1 && !(i.length === 2 && i.charAt(0)==='\\')){
            i.split('').forEach(function (symbol) {
                tokens[symbol] = tokens[i];
            });
            delete tokens[i];
        }
    }

    var tokenizer = function(text, source){

        var PointerFactory = AbstractPointerFactory(source),

            i, _i, symbol, lastSymbol,

            out = [],

            cursor = new PointerFactory({col: 1, row: 1});


        var addWord = function (word, position, type) {
            if(word !== '') {
                out.push({
                    data: word,
                    pointer: position.clone(),
                    type: type,
                    leaf: true
                });
                lastCursor = cursor.clone();//.add(1);
            }
        };


        var state = 'FIRST', lastPosition = 0, lastCursor = cursor.clone();
        var added;
        /** char by char parsing */

        for( i = 0, _i = text.length; i < _i; i++ ){
            added = false;
            symbol = text.charAt( i );
            if(tokens[symbol]){
                addWord(text.substr(lastPosition, i - lastPosition), lastCursor, state);

                addWord(symbol, lastCursor, tokens[symbol]);
                lastPosition = i + 1;
                added = true;
            }else{
                state = 'WORD'
            }

            if(symbol === '\n'){
                cursor = cursor.nextLine();
            }else if(symbol === '\t') {
                // stable magic spell
                cursor = cursor.add(
                    (((
                        (cursor.col-1) // col starts from 1
                        /4)|0) // get full count of tabs
                        +1) // add one tab
                    *4 // count spaces
                    +1 // col starts from one again
                    -cursor.col // decrement current position
                );
            }else{
                cursor = cursor.add(1);
            }
            if(added)
                lastCursor = cursor.clone();
            lastSymbol = symbol;

        }

        // and the last one
        addWord(text.substr(lastPosition, i - lastPosition), lastCursor, state);

        return out;
    };
    return tokenizer;
})();