/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 4/25/17.

module.exports = (function () {
    'use strict';
    //buildPipe.call(this, item.item.value, obj, whos, sm);
    var functionTransformer = function(item, obj, whos, sm){
        return 'function(){'+item.body.data+'}';
        
    };
    return functionTransformer;
})();