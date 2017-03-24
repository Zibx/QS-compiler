/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 2/7/17.

module.exports = (function () {
    'use strict';

    /* TODO: transform it to linker. we can not collect metadata,
     TODO: it is a recursive operation in quokkaScript
     TODO: we do not know how to traverse a node until
     TODO: we know how to do it
     */
    var VariableExtractor = require('../JS/VariableExtractor');
    var primitives = {
            'Number': true, 'String': true, 'Array': true, 'Boolean': true, 'Function': true
        },
        escodegen = require('escodegen');


})();