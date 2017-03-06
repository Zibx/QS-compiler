/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 3/6/17.

module.exports = (function () {
    'use strict';
    return {
        __compile: function(obj){
            var baseClassName = obj.extend[0];
            var source = [],
                ending = [];



            source.push('var '+ obj.name +' = '+ baseClassName +
                '.extend(\'App'+baseClassName+'\', \''+obj.name+'\', {');

            source.push('ctor: function(){');

            source.push('}');

            source.push('});');




            console.log(source.concat(ending).join('\n'));
            debugger;
        }
    };
})();