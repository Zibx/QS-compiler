/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2016
// By zibx on 12/22/16.

module.exports = (function () {
    'use strict';
    var AbstractPointerFactory = function(source){
        var PointerFactory = function( cfg ){
            if( cfg.col ){
                this.col = cfg.col;
                this.row = cfg.row;
            }
        };
        PointerFactory.prototype = {
            source: source,
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
            }
        };

        return PointerFactory;
    };
    return AbstractPointerFactory;
})();