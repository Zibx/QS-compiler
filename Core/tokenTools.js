/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 2/3/17.

module.exports = (function () {
    'use strict';

    var a2o = function(arr){
        return arr.reduce(function(store, item){
            store[item] = true;
            return store;
        }, {});
    };
    var insertIntoString = function(to, from, at){
        return (to.substr(0,at) +
            (to.length < at ? new Array(at-to.length+1).join(' '):'') +
            from + to.substr(at+from.length));
    };
    var tools = {
        match: function(token, rule){
            var suit = true, whatever;
            if ('type' in rule) {
                if(rule.type === 'ALL')
                    whatever = true;
                if(!token)debugger;
                if (token.type !== rule.type)
                    suit = false;
            }

            if ('info' in rule) {
                if (token.info !== rule.info)
                    suit = false;
            }

            if ('data' in rule) {
                if(typeof rule.data === 'string') {
                    if (token.data !== rule.data)
                        suit = false;
                }else{
                    if(rule.data instanceof Array) {
                        rule.data = a2o(rule.data);
                    }
                    if(!(token.data in rule.data))
                        suit = false;
                }
            }
            if(suit || whatever)
                return token;
            else
                return false;
        },
        split: function(tokens, splitter,noEmpty){
            // noEmpty flag is used when you want to exclude empty items
            var out = [], list = [], i, _i, token;
            for(i = 0, _i = tokens.length; i < _i; i++){
                token = tokens[i];
                if(tools.match(token, splitter)) {
                    if(!noEmpty || list.length>0)
                        out.push(list);
                    list = [];
                }else
                    list.push(token);
            }
            if(!noEmpty || list.length>0)
                out.push(list);
            return out;
        },
        trim: function(tokens){
            /*console.log('--- TRIM ---')
            console.log(tokens)*/
            
            var start = 0, end = tokens.length, i, _i, token;//, list = [];
            for(i = 0, _i = end; i < _i; i++){
                token = tokens[i];

                if(!tools.match(token,{type: 'SPACE'})) {
                    start = i;
                    break;
                }
            }
            for(end--;end>start;end--)
                if(!tools.match(tokens[end],{type: 'SPACE'}))
                    break;


            return tokens.slice(start);
        },
        toString: function(tokens, lines, firstLine, cfg){
            cfg = cfg || {};
            firstLine = firstLine == void 0 ? tokens[0].pointer.row : firstLine;
            lines = lines || [];
            var token, insertInLine, tokenCol,
                line, i, _i, j;
            for(i = 0, _i = tokens.length; i < _i; i++){
                token = tokens[i];
                if(('data' in token || '_data' in token) && (cfg.comments ? true : token.type !== 'Comment')) {
                    insertInLine = token.pointer.row - firstLine;
                    tokenCol = token.pointer.col;
                    if(!(insertInLine in lines)) {
                        for(j = lines.length; j <= insertInLine; j++)
                            lines[j] = '';
                        //lines[insertInLine] = '';
                    }

                    line = lines[insertInLine];

                    var dataToInsert = '_data' in token ? token._data : token.data;
                    if(token.type==='PIPE'){
                        dataToInsert = '{{'+ dataToInsert +'}}';
                    }

                    lines[insertInLine] = insertIntoString(line,dataToInsert, tokenCol);

                }else if(cfg.comments || token.type !== 'Comment'){

                    tools.toString(token.tokens, lines, firstLine, cfg);
                    if(token.children)
                        tools.toString(token.children, lines, firstLine, cfg);
                    //console.log(x)
                }

            }
            return {data: lines.join(''), pointer: tokens[0].pointer, lines: lines};
        }
    };
    return tools;
})();