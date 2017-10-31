/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 10/20/17.

module.exports = (function(){
    'use strict';
    var Property = function(cfg){
        if(cfg.class === void 0)
            debugger;
        Object.assign(this, cfg);
    };
    Property.prototype = {
        getName: function () {
            var nameTokens = this.name;
/*            if(nameTokens[nameTokens.length - 1] === 'value') {
                return nameTokens.slice(0, nameTokens.length - 1).join('.');
            }else {*/
                return nameTokens.join('.')
//            }
        },
        getValue: function () {
            return this.value;
        }
    };
    return Property;
})();