/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */;// Copyright by Ivan Kubota. 1/8/2017

module.exports = (function(ast){
    'use strict';

    var process = function (ast) {
        var iterator = ast.getIterator(),
            token;
        while(!iterator.lastLeaf){
            iterator.nextLeaf();
            token = iterator.data;
            console.log(token);

        }
    };
    return process;
})();