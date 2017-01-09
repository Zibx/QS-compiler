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
        next: function ( stay ) {
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
        isNext: function(){
            return !!this.next(true);
        },
        nextLeaf: function (stay) {
            var pointer = this.pointer,
                way = this.way,
                domain;

            if(way){
                domain = way[way.length - 1];
                pointer = domain.pointer;
                while(way.length) {

                    if (!pointer.leaf) {
                        if (pointer instanceof Array) {
                            if (pointer.length > domain.index + 1) {
                                domain.index++;
                                pointer = pointer[domain.index];
                            } else {
                                if(way.length === 2){
                                    return false;
                                }
                                way.pop();
                                domain = way[way.length - 1];
                                pointer = domain.pointer;

                            }

                        } else {
                            while (!pointer.leaf) {
                                domain = {index: 0, pointer: pointer.tokens};
                                way.push(domain);
                                pointer = domain.pointer[domain.index];
                            }
                            return pointer;
                        }
                    }else{
                        return pointer;
                    }
                }
                //console.log(way, pointer)

            }
            return false;
        },
        isNextLeaf: function(){
            return !!this.nextLeaf(true);
        },
        init: function () {
            this.last = !this.isNext();
            this.lastLeaf = !this.isNextLeaf();
        }
    };
    return Iterator;
})();