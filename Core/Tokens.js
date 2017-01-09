/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// Copyright by Ivan Kubota. 1/8/2017
module.exports = (function () {
    'use strict';
    var Iterator = require('./Iterator');

    var tokens = {};
    var protoToken = {
        type: null,
        leaf: true,
        push: function (item) {
            this.leaf = false;
            (this.tokens = (this.tokens || [])).push(item)
        },
        getIterator: function () {
            return new Iterator(this);
        }
    };

    ['Body', 'Line'].forEach(function (name) {
        tokens[name] = function () {

        };
        var proto = tokens[name].prototype = Object.create(protoToken);
        proto.type = name;
    });
    return tokens;
})();