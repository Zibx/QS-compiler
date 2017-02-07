/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 2/7/17.

module.exports = (function () {
    'use strict';
    var extractor = function(ast){
        //debugger;
        var i, prop, propClass;

        var info = {
            require: {},
            exports: {}
        };
        for(i in ast.public) {
            prop = ast.public[i];
            propClass = prop.class;
            info.exports[i] = prop;
            //(info.require[propClass.data] || (info.require[propClass.data] = [])).push(prop);
        }

        for(i in ast.items) {
            prop = ast.items[i];
            propClass = prop.class;
            //info.exports[i] = prop;
            (info.require[propClass.data] || (info.require[propClass.data] = [])).push(prop);
        }

        return info;
    };
    return extractor;
})();