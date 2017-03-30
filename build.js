/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 3/29/17.

module.exports = (function () {
    'use strict';
    var fs = require('fs'),
        path = require('path')
        ;
    var showHelp;

    function readDirRecursive(dir) {
        var entries = fs.readdirSync(dir);
        var ret = [];
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            var fullPath = path.join(dir, entry);
            var stat = fs.statSync(fullPath);
            if (stat.isFile()) {
                /*if (entry == "TypeTable.js")
                 ret.push("module.exports.TypeTable=require('../" + fullPath.replace(/\\/g, "/") + "')");
                 else*/
                ret.push(fullPath.replace(/\\/g, "/"));
            }
            if (stat.isDirectory()) {
                ret = ret.concat(readDirRecursive(fullPath));
            }
        }
        return ret;
    };

    var build = function build(cfg){

        cfg.config = cfg.config || cfg.c;
        if(!cfg.config)
            showHelp('No config file specified');

        try {
            var config = JSON.parse(fs.readFileSync(cfg.config) + '');
        }catch(e){
            showHelp('JSON config is corrupted or not exists ('+cfg.config+')', e)
        }

        console.log('JSON config parsed ('+cfg.config+')');
        if(!config.lib){
            showHelp('lib dir is not specified in config');
        }
        var libDir = path.resolve(config.basePath || __dirname,config.lib);
        try {
            var files = readDirRecursive(libDir);
        }catch(e){
            showHelp('Error reading directory ('+libDir+')', e);
        }
        console.log(files.map(function(filePath){return path.basename(filePath);}))

        console.log(config);
        console.dir(cfg);
    };

    if(module.parent){

        showHelp = function(error){
            throw new Error(error);
        };
    }else{
        showHelp = function(error, more){
            console.log('Error: '+(error||'Unknown'));
            if(more)
                console.log(more);
            console.log('node build -c ******.json -fd');
            process.exit();
        };
        build(require('minimist')(process.argv.slice(2)));
    }

    return build;
})();