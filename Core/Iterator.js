/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// Copyright by Ivan Kubota. 1/8/2017

module.exports = (function () {
    'use strict';
    var Iterator = function (tokens) {
        this.tokens = tokens;
        this.pointer = -1;
        this.last = !!tokens.length;
    };
    Iterator.prototype = {

    };

    return Iterator;
})();