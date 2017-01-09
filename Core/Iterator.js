/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// Copyright by Ivan Kubota. 1/8/2017

module.exports = (function () {
    'use strict';
    var Iterator = function (ast) {
        this.pointer = this.ast = ast;
        this.init();
    };
    Iterator.prototype = {
        ast: null,
        pointer: null,
        last: true,
        lastLeaf: true,
        way: null,
        next: function () {
            var ast = this.ast,
                pointer = this.pointer;
            if(this.way === null){
                if(!ast){
                    this.last = true;
                }else {
                    this.way = [{pointer: ast}];
                    this.data = ast;
                    this.last = false;
                }
            }else{

            }
        },
        nextLeaf: function () {
            var ast = this.ast,
                pointer = this.pointer,
                way = this.way,
                domain, item;
            if(way){

                item = way[way.length - 1];
                domain = way[way.length - 2];

                while(!item.pointer.leaf){
                    domain = item.pointer.tokens;
                    item = item.pointer.tokens[0]

                }

            }
            console.log(this.pointer)
        },
        init: function () {
            this.last = !this.next();
            this.lastLeaf = !this.nextLeaf();
        }
    };
    return Iterator;
})();