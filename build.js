/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 3/29/17.

module.exports = (function () {
    'use strict';
    var fs = require('fs');
    var showHelp;


    var build = function build(cfg){

        cfg.config = cfg.config || cfg.c;
        if(!cfg.config)
            showHelp('No config file specified');

        var config = JSON.parse(fs.readFileSync(cfg.config)+'');
        console.log(config);
        console.dir(cfg);
    };

    if(module.parent){

        showHelp = function(error){
            throw new Error(error);
        };
    }else{
        showHelp = function(error){
            console.log('Error: '+(error||'Unknown'));
            console.log('node build -c ******.json -fd');
            process.exit();
        };
        build(require('minimist')(process.argv.slice(2)));
    }

    return build;
})();