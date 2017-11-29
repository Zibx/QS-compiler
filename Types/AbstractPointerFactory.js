/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2016
// By zibx on 12/22/16.

module.exports = (function () {
    'use strict';
    var distance = function(a, b) {
        var i, aLength = a.length, bLength = b.length, row, prev, val;
        if(aLength === 0) return bLength;
        if(bLength === 0) return aLength;

        // swap to save some memory O(min(a,b)) instead of O(a)
        if(a.length > b.length) {
            var tmp = a;
            a = b;
            b = tmp;
        }

        row = [];
        // init the row
        for(i = 0; i <= aLength; i++){
            row[i] = i;
        }

        // fill in the rest
        for(i = 1; i <= b.length; i++){
            prev = i;
            for(var j = 1; j <= aLength; j++){
                if(b.charAt(i-1) === a.charAt(j-1)){
                    val = row[j-1]; // match
                } else {
                    val = Math.min(row[j-1] + 1, // substitution
                        prev + 1,     // insertion
                        row[j] + 1);  // deletion
                }
                row[j - 1] = prev;
                prev = val;
            }
            row[a.length] = prev;
        }

        return row[a.length];
    };
    var Distance = function(a, b, text){
        this.search = a;
        this.matchTo = b;
        this.distance = distance(a,b);
        console.log(a,b, this.distance);
        this.description = text;
    };
    Distance.sort = function(a,b){
        return a.distance - b.distance;
    };
    Distance.isNear = function(item){
        return item.distance < 5;
    };
    var AbstractPointerFactory = function(source, code){
        var PointerFactory = function( cfg ){
            if( cfg.col ){
                this.col = cfg.col;
                this.row = cfg.row;
            }
        };
        PointerFactory.prototype = {
            errors: [],
            source: source,
            code: code,
            col: 1,
            row: 1,
            clone: function( i ){
                return new PointerFactory( this ).add( i );
            },
            nextLine: function(){
                this.col = 1;
                this.row++;
                return this;
            },
            add: function( i ){
                if( i !== void 0 )
                    this.col += i;

                return this;
            },
            error: function(description, info, suggestions, strategy){
                if(Array.isArray(info)){
                    suggestions = info;
                    info = this;
                }
                if(info === void 0)
                    info = this;

                if(info.column){
                    var jsInfo = info;
                    if(strategy === 'pipe'){
                        info = {col: jsInfo.line > 2 ? jsInfo.column + 1 :this.col + 1 + jsInfo.column, row: this.row + jsInfo.line - 2, source: this.source};
                    }else {
                        info = {col: jsInfo.column, row: this.row + jsInfo.line - 2, source: this.source};
                    }
                }
                if(info.col === void 0) {
                    info.col = this.col;
                }
                if(info.row === void 0) {
                    info.row = this.row;
                }
                info = new PointerFactory(info);

                var item = {
                    description: description.replace('%POS%', info.toString()),
                    col: info.col,
                    row: info.row,
                    suggestions: suggestions && suggestions.filter(Distance.isNear).sort(Distance.sort),
                    pointer: info
                };
                this.errors.push(item);
                return item;
            },
            suggest: function(text, search){
                return function( matchTo ){
                    return new Distance(search, matchTo, text);
                }
            },
            toString: function () {
                return '('+ [this.source,this.row, this.col].join(':') +')';
            }
        };

        return PointerFactory;
    };
    return AbstractPointerFactory;
})();