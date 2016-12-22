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
    var braces = ['()', '{}', '[]'],
        braceOpen = {},
        braceClose = {},
        braceType = {};

    braces.forEach( function( el, i ){
        braceOpen[el[0]] = el[1];
        braceClose[el[1]] = el[0];
        braceType[el[0]] = braceType[el[1]] = i;
    } );

    var SINGLELINECOMMENT = 1,
        MULTILINECOMMENT = 2;

    var quotes = {'"': '"', '\'': '\''};
    var tokenizer = function(text, source){

        var PointerFactory = AbstractPointerFactory(source),
            /** quotes can be single or double*/
            inQuote = false, quoteType = void 0,
            /** comments can be multiline or singleline*/
            inComment = false, commentType = void 0,

            escape = false,
            tokenStart,
            tokenStartCursor,

            lastTokenStart, lastTokenStartCursor,

            i, _i, symbol, sLast, tmp,

            out = [],

            cursor = new PointerFactory({col: 1, row: 1});

        /** char by char parsing */
        for( i = 0, _i = text.length; i < _i; i++ ){

            /** s - current symbol, sLast - previous symbol */
            symbol = text.charAt( i );

            if( inComment || inQuote ){
                if( inComment ){
                    if( commentType === SINGLELINECOMMENT){
                        if(sLast === '.'){
                            /** if it is url */
                            tmp = text.substr(tokenStart, i - tokenStart+1);
                            if(lastItem && !!lastItem.pureData.match(/\w+:$/) &&
                                !!tmp.match(/^\/\/\w+\.\w+$/)){
                                inComment = false;
                            }
                        }
                        if( symbol === '\n' ) {
                            /** close of one line comment */
                            pushItem({
                                pos: tokenStart,
                                data: text.substr(tokenStart, i - tokenStart),
                                _type: 'comment',
                                pureData: text.substr(tokenStart + 2, i - tokenStart - 2)
                            });
                            tokenStart = i + 1;
                            tokenStartCursor = cursor.clone(1);
                            inComment = false;
                        }
                    }else if( commentType === MULTILINECOMMENT && sLast === '*' && symbol === '/' ){
                        /** close of multi line comment */
                        pushItem( {
                            pos: tokenStart,
                            data: text.substr( tokenStart, i - tokenStart + 1 ),
                            _type: 'comment',
                            pureData: text.substr( tokenStart + 2, i - tokenStart - 3 )
                        }, tokenStartCursor );
                        //console.log('<',tokenStartCursor)
                        tokenStart = i + 1;
                        tokenStartCursor = cursor.clone();
                        inComment = false;
                    }
                }else{ /** if inQuote */
                    if( symbol === quoteType ){
                        /** close of quote - check that it's same quote that was opened */
                        pushItem( {
                            pos: tokenStart,
                            data: text.substr( tokenStart, i - tokenStart + 1 ),
                            pureData: text.substr( tokenStart + 1, i - tokenStart - 1 ),
                            _type: 'quote'
                        }, tokenStartCursor );
                        tokenStart = i + 1;
                        tokenStartCursor = cursor.clone();
                        inQuote = false;
                    }
                }
            }else{
                //lastTokenStart = tokenStart;
                //lastTokenStartCursor = tokenStartCursor.clone();

                if( quotes[symbol] && !escape ){
                    /** quote open */
                    quoteType = symbol;
                    inQuote = true;
                    tokenStart = i;
                    tokenStartCursor = cursor.clone( -1 );

                }else if( sLast === '/' && symbol === '*' ){
                    /** multi line comment open */
                    commentType = MULTILINECOMMENT;
                    inComment = true;
                    tokenStart = i - 1;
                    tokenStartCursor = cursor.clone( -2 );
                    //console.log(tokenStartCursor,cursor)
                    //debugger;
                }else if( sLast === '/' && symbol === '/' ){
                    /** single line comment open */
                    commentType = SINGLELINECOMMENT;
                    inComment = true;
                    tokenStart = i - 1;
                    tokenStartCursor = cursor.clone( -2 );

                }

                /** if start of token changed in this brunch -> store intermediate data as text */
                if( lastTokenStart < tokenStart ){
                    pushItem( {
                        pos: lastTokenStart,
                        data: text.substr( lastTokenStart, tokenStart - lastTokenStart ),
                        pureData: text.substr( lastTokenStart, tokenStart - lastTokenStart ),
                        _type: 'text'
                    }, lastTokenStartCursor );
                    tokenStartCursor = lastTokenStartCursor = cursor.clone(-1);
                    //tokenStart = i;
                }
                if( braceOpen[symbol] ){
                    /** brace open -> push it's type and position to stack */
                    pushItem( {
                        pos: tokenStart,
                        data: text.substr( tokenStart, i - tokenStart ),
                        pureData: text.substr( tokenStart, i - tokenStart ),
                        _type: 'text'
                    }, tokenStartCursor );

                    tokenStart = i+1;
                    tokenStartCursor = cursor.clone(1);
                    pushItem( {
                        pos: i,
                        data: '@@@',
                        pureData: '@@@',
                        _type: 'brace',
                        info: symbol,
                        _info: braceOpen[symbol]
                    } );
                    var item = tree.items.pop();
                    item.items = [];
                    item.parent = tree;
                    tree.items.push( item );
                    //stack.push(item);
                    tree = item;
                    braceStack.push( { _type: symbol, pos: i, cursor: cursor.clone() } );
                }else if( braceClose[symbol] ){
                    /** brace close -> check that there is corresponding open one */

                    topBrace = braceStack.pop();
                    if( topBrace && braceClose[symbol] === topBrace._type ){

                        pushItem( {
                            pos: tokenStart,
                            data: text.substr( tokenStart, i - tokenStart ),
                            pureData: text.substr( tokenStart, i - tokenStart ),
                            _type: 'text'
                        }, tokenStartCursor );

                        tree.data = text.substr( topBrace.pos, i - topBrace.pos + 1 );
                        tree.pureData = text.substr( topBrace.pos, i - topBrace.pos + 1 );
                        tree = tree.parent;

                        lastPushedPos = tokenStart = i + 1;
                        tokenStartCursor = cursor.clone( 1 );
                    }else{
                        throw new Error(
                            'Invalid brace. opened: `' + (topBrace ? topBrace._type : 'No brace') + '`, closed: `' + symbol + '`'
                        );
                    }

                }

            }

            if( symbol === '\n' && !inComment && !inQuote ){
                /** SEAL */
                console.log(i)
                pushItem( {
                    pos: tokenStart,
                    data: text.substr( tokenStart, i - tokenStart ),
                    pureData: text.substr( lastTokenStart, i - tokenStart ),
                    _type: 'text'
                }, lastTokenStartCursor );
                lastPushedPos = tokenStart = i + 1;
                lastPushedPosCursor = tokenStartCursor = cursor.clone();//.nextLine();

                seal( line, tree );
                line.items = tree.items;
                line = { row: cursor.row +(symbol === '\n' ?1:0)};
                lines.push( line );

                tree = { items: [] };
            }

            //TODO logics
            if( symbol === '\\4' )
                escape = !escape;
            sLast = symbol;

            cursor.col++;
            if( symbol === '\n' ){
                cursor.row++;
                cursor.col = 1;
            }
        }


        return 4;
    };
    return tokenizer;
})();