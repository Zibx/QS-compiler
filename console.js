/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 4/28/17.

module.exports = (function () {
    'use strict';
    var args = require('minimist')(process.argv.slice(2));

    var Logger = function(namespace){
        this.ns = namespace;
        this.logs = [];
    };
    for(var i in console)
        if(typeof console[i] === 'function')
            (function(name){
                Logger.prototype[name] = function () {
                    this.logs.push({type: name, ns: this.ns, data: [].slice.call(arguments)});
                    global.console[name].apply(global.console, arguments)
                };
            })(i);

    return Logger;
})();