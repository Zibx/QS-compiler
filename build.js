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
        cfg.verbose = cfg.verbose || cfg.v;

        /** LOAD CONFIG */
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

        /** READ ALL MODULES OF LIB */
        var libDir = path.resolve(config.basePath || __dirname,config.lib);
        try {
            var files = readDirRecursive(libDir);
        }catch(e){
            showHelp('Error reading directory ('+libDir+')', e);
        }
        cfg.verbose && console.log('List of lib files: '+files.map(function(filePath){
                return path.basename(filePath);
            }).join(', '));


        /** LOAD LIB MODULES */
        var classes = {};
        files.forEach(function (filePath) {
            try {
                classes[filePath] = require(filePath);
            }catch(e){
                showHelp('Can not load module '+filePath, e)
            }
        });

        /** LOAD TYPE TABLE */
        var typeTable;
        if(!config.typeTable){
            showHelp('type table dir is not specified in config');
        }

        var typeTableDir = path.resolve(config.basePath || __dirname, config.lib, config.typeTable);
        try {
            typeTable = require(typeTableDir);
        }catch(e){
            showHelp('Can not load type table '+typeTableDir, e)
        }


        /** TRY BUILDING */
        var tokenizer = require('./Core/Tokenizer'),
            lexer = require('./Core/Preprocess'),
            Compiler = require('./Core/Compile/Compiler');

        var sourcePath = path.resolve(config.basePath || __dirname, config.build);
        var data = fs.readFileSync(sourcePath) + '',
            tokens = tokenizer(data, sourcePath),
            lex = lexer(tokens);

        var compiler  = new Compiler({
            searchDeps: function (fileNames) {
                var i, _i, fileName, matched;
                for(i = 0, _i = fileNames.length; i < _i; i++){
                    fileName = fileNames[i];
                    matched = typeTable.search(fileName);
                    if(matched.length){
                        if(matched.length === 1){
                            compiler.addNative(matched[0]);
                        }else{
                            throw new Error('TOO COMPLEX (сложна)');
                        }
                    }
                }


            }
        });

        lex.forEach(function(item){
            compiler.add(item);
            //item.metadata = metadata.extract(item);
        });

        var result = compiler.compile(config.main || 'main', {sourceMap: true}),
            finalSource = result.source;
        console.log('Compiled')


        if(!config.output){
            console.log(finalSource);
        }else{
            var outputBase;
            if('basePath' in config.output){
                outputBase = config.output.basePath;
            }else{
                outputBase = config.basePath || __dirname;
            }
            var fileName = path.basename(config.build);
            var outputPath = path.resolve(
                    outputBase,
                    config.output.fileName || (path.parse(fileName).name+'.js')
                ),
                mapPath = path.resolve(
                    outputBase,
                    config.output.mapFileName || (path.parse(fileName).name+'.map')
                ),
                qsPath = path.resolve(
                    outputBase,
                    config.output.qsFileName || (fileName)
                );

            fs.writeFileSync(outputPath, finalSource+'\n' +
                '//# sourceMappingURL='+path.relative(outputBase, mapPath)+'\n'+
                '//# sourceURL='+path.relative(outputBase, qsPath));

            var map = JSON.parse(result.map);
            map.sources = [path.relative(outputBase, qsPath)];


            fs.writeFileSync(mapPath, JSON.stringify(map));


            fs.writeFileSync(qsPath, data);

            console.log('OUTPUT: '+ outputPath)
        }
        //typeTable.search('Timer'))
        
        
        console.log(config);
        //console.dir(cfg);
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