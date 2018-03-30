/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 3/29/17.

module.exports = (function () {
    'use strict';
    var exclude = {
        'node_modules': true
    };
    var fs = require('fs'),
        path = require('path')
        ;
    var showHelp;
    //var console = new (require('./console'))('build');
    function readDirRecursive(dir) {
        //console.log('Read', dir)
        var entries = fs.readdirSync(dir);
        var ret = [];
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if(entry.indexOf('.') === 0 || exclude[entry])
                continue;

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
    var options = {
        lib: {
            short: 'l',
            info: 'standard library directory. Is relative to basePath'
        },
        typeTable: {
            short: 't',
            info: 'path to typeTable relative to lib directory. Type table is required to resolve namespaces'
        },
        build: {
            short: 'b',
            info: 'path to qs relative to basePath'
        },
        basePath: {
            short: 'p',
            info: 'base path',
            value: 'current path'
        },
        output: {
            short: 'o',
            info: 'output path. Relative to basePath'
        },
        verbose: {
            short: 'v',
            info: 'show debug logging'
        },
        config: {
            short: 'c',
            info: 'config path. Config can contain any property from this list'
        },
        main: {
            short: 'm',
            info: 'main object. Entry point of project'
        }
    };

    var Compiler = require('./Core/Compile/Compiler'),
        cTools = require('./Core/Compile/tools');

    var build = function build(cfg, callback){
        var config, i, opt, _i,
            errors = [];

        for(i in options){
            opt = options[i];
            if(opt.short)
                cfg[i] = cfg[i] || cfg[opt.short];
        }

        /** LOAD CONFIG */
        if(!cfg.config){
            //showHelp('No config file specified');
            config = cfg;
        }else {
            try {
                config = Object.assign({}, JSON.parse(fs.readFileSync(cfg.config) + ''), cfg);
            } catch (e) {
                showHelp('JSON config is corrupted or not exists (' + cfg.config + ')', e)
            }
            console.log('JSON config parsed ('+config.config+')');
        }


        if(!('lib' in config)){
            showHelp('lib dir is not specified in config');
        }


        var libCache = {};

        if(config.lib) {
            if(!Array.isArray(config.lib)){
                config.lib = [config.lib];
            }

            /** LOAD TYPE TABLE */
            var typeTable;
            if (!config.typeTable) {
                showHelp('type table dir is not specified in config');
            }

            if(typeof config.typeTable === 'object') {
                typeTable = config.typeTable;
            }else{
                var typeTableDir = path.resolve(config.basePath || __dirname, config.lib[0], config.typeTable);
                try {
                    typeTable = require(typeTableDir);
                } catch (e) {
                    showHelp('Can not load type table ' + typeTableDir, e)
                }
            }
            var currentFile;
            var qsList = [];
            var qsCache = {};
            for(i = 0, _i = config.lib.length; i < _i; i++) {

                var lib = config.lib[i];
                /** READ ALL MODULES OF LIB */
                var libDir = path.resolve(config.basePath || __dirname, lib);

                try {
                    var files = readDirRecursive(libDir);
                } catch (e) {
                    showHelp('Error reading directory (' + libDir + ')', e);
                }

                config.verbose && console.log('List of lib files in ' + lib + ': ' + files.map(function (filePath) {
                        return path.basename(filePath);
                    }).join(', '));

                /** LOAD LIB MODULES */
                var classes = {};
                files.forEach(function (filePath) {
                    var parsed = path.parse(filePath);
                    if(parsed.ext !== '.js') {
                        if(parsed.ext === '.qs') {
                            qsList.push({fileName: filePath, data: fs.readFileSync(filePath).toString('utf-8')});

                        }
                        return;
                    }

                    try {
                        currentFile = filePath;
                        /*const types = require('type-inference');

                        const typeData = types.inferType(
                            types.parseSource(
                                types.readFile(
                                    types.boxFilename(
                                        filePath
                                    )
                                )
                            )
                        );

                        debugger*/


                        classes[filePath] = require(filePath);
                    } catch (e) {
                        showHelp('Can not load module ' + filePath, e)
                    }
                });
                if(typeof QRequire !== 'undefined')
                    files.forEach(function (filePath) {
                        if(classes[filePath] instanceof QRequire.Waiter) {
                            var c = classes[filePath] = classes[filePath].res;
                            if(Array.isArray(c)){
                                c.forEach(function(c){
                                    libCache[c.name] = c;
                                });
                            }else {
                                libCache[c.name] = c;
                            }
                        }
                    });
            }





        }
        /** TRY BUILDING */
        var tokenizer = require('./Core/Tokenizer'),
            lexer = require('./Core/Preprocess');

        if(config.build) {
            if(!Array.isArray(config.build))
                config.build = [config.build];

            var sourcePaths = config.build.map(function(buildPath){
                return path.resolve(config.basePath || __dirname, buildPath);
            });
            var data = sourcePaths.map(function(sourcePath, i){
               // debugger;
                if(config.fileGetter){
                    return config.fileGetter(config.build[i]);
                }else
                    return (fs.readFileSync(sourcePath) + '');
            });
            
        }else if(config.source){
            sourcePaths = [config.ns || 'inline'];
            data = [config.source];
        }else{
            showHelp('Specify `build` option or give source' + typeTableDir)
        }

        data = data.map(function(data){
            return data.replace(/\r/g, '');
        });
        var errorStorage = [];
        var lexes = sourcePaths.map(function(sourcePath, i){
            var tokens = tokenizer(data[i], sourcePath),
                lex = lexer(tokens, false, errorStorage);
            return lex;
        });
        var lex = [].concat.apply([],lexes);

        var compiler  = new Compiler({
            ns: config.ns,
            searchDeps: function (dependencies) {

                var i, _i, dependency, matched = [], fileName;
                for(i = dependencies.length - 1; i >= 0; i--){
                    dependency = dependencies[i];
                    fileName = dependency.toString();
                    if(libCache[fileName]){
                        matched = [libCache[fileName]];
                        matched[0].ctor = matched[0];
                    } else {
                        try {
                            matched = typeTable.search(fileName);
                        }catch(e){
                            errorStorage.push(dependency.item.pointer.error('Unresolved dependency '+ fileName +''));
                            //throw new Error('Error matching `' + fileName + '` '+dependency.item.pointer)
                        }
                       }


                    if(matched.length){
                        if(matched.length === 1){
                            //console.log(matched[0]);
                            this.addNative(matched[0]);
                            var parent = matched[0].parent;
                            if(parent)
                                this.searchDeps([parent.name]);
                            //console.log('Dep resolved ', fileName, matched[0].namespace)
                        }else{
                            throw new Error('TOO COMPLEX (сложна)');
                        }
                    }
                }


            }
        });

        qsList.forEach(function(item){
            var tokens = tokenizer(item.data, item.fileName),
                lex = lexer(tokens);
            item.lex = lex;
            lex.forEach(function(item){
                compiler.add(item, {staticNS: true});
            });
        });
        compiler.baseInited = true;

        lexes.forEach(function(lex){
            lex.forEach(function(item){
                compiler.add(item);
            });
        });

        lex.forEach(function(lex){
            var name = lex.name.data;

            var fileInfo = path.parse(lex.name.pointer.source);
            var nsName = compiler.getTag(lex, 'ns');
            var ns;
            if(config.ns){
                ns = config.ns;
            }else{
                var nsTokens = [];
                if(config.ns !== false)
                    nsTokens.push(fileInfo.name);

                if(nsName)
                    nsTokens.push(nsName);

                ns = nsTokens.join('.');
            }
            if(!(name in compiler.world)){
                errors.push('Building error. '+name+' was not compiled')
            }else {
                compiler.world[name].setNameSpace(ns);
            }
        });

        if(!config.main){
            if(lex.length === 1){
                config.main = lex[0].name.data;
            }else{
                var filtered = lex.filter(function(el){
                    return el.extend[0].data !== 'UIComponent';
                });
                if(filtered.length === 1){
                    config.main = filtered[0].name.data;
                }else{
                    var err
                    while(errorStorage.length){
                        errors = errors.concat(errorDrawer(errorStorage.shift()));
                    }
                    errors.push('main object is not specified');
                    errors.length && console.error(errors.join('\n\n'));
                    return typeof callback === 'function' && callback({
                        ast: {}, js: '', lex: [].concat.apply([],lexes), world: compiler.world, main: null,
                        errorList: errors, error: errors.length ? errors.join('\n\n') : false
                    });
                    //showHelp('Please specify main object')
                }
            }
        }

        var mainObj = config.main || 'main';

        var asts = {};

        if(compiler.world[mainObj]) {
            asts[mainObj] = compiler.world[mainObj];
            var result = compiler.compile(mainObj, {sourceMap: false, newWay: config.newWay, ns: config.ns}),
                finalSource = lexes.map(function (lex, i) {
                        return '//' + sourcePaths[i] + '\n' + lex.map(function (item) {
                                asts[item.name.data] = compiler.world[item.name.data];
                                return mainObj !== item.name.data ? compiler.compile(item.name.data, {
                                    sourceMap: true,
                                    newWay: config.newWay,
                                    ns: config.ns
                                }).source : ''
                            }).join('\n\n');
                    }).join('\n\n') + result.source;


        //console.log('Compiled')

            for( i in asts ){
                var item = asts[i],
                    pointer = item.ast.name.pointer;
                if(pointer.errors.length){
                    errors = errors.concat(pointer.errors.map(errorDrawer));
                }
            }
        }

        while(errorStorage.length){
            errors = errors.concat(errorDrawer(errorStorage.shift()));
        }

        errors.length && console.error(errors.join('\n\n'));
        if(!config.output){
            //console.log(finalSource);
            typeof callback === 'function' && callback({
                ast: asts, js: finalSource, lex: [].concat.apply([],lexes), world: compiler.world, main: mainObj,
                errorList: errors, error: errors.length ? errors.join('\n\n') : false
            });
        }else{
            if(typeof config.output === 'string'){
                /* lets predict! */
                var parsed = path.parse(config.output);
                if(!parsed.ext){
                    config.output = {basePath: config.output};
                }else{
                    config.output = {
                        basePath: parsed.dir,
                        fileName: config.output
                    };
                }
            }
            var outputBase;
            if('basePath' in config.output){
                outputBase = config.output.basePath;
            }else{
                outputBase = config.basePath || __dirname;
            }

            var buildResults = config.build.map(function(buildPath, i){
                var fileName = path.basename(buildPath);
                var outputPath = path.resolve(
                    outputBase,
                        config.output.fileName || (path.parse(fileName).name+'.js')
                    ),
                    mapPath = path.resolve(
                            outputBase,
                            config.output.mapFileName || (path.parse(fileName).name+'.map')
                        )+(config.ext||''),
                    qsPath = path.resolve(
                            outputBase,
                            config.output.qsFileName || (fileName)
                        )+(config.ext||'');
                var getLine = '';
                if(config.get){
                    getLine = '?'+require('querystring').stringify(config.get);
                }
                fs.writeFileSync(outputPath, finalSource+'\n' +
                    '//# sourceMappingURL='+path.relative(outputBase, mapPath)+getLine+'\n'+
                    '//# sourceURL='+path.relative(outputBase, qsPath)+getLine);

                var map = JSON.parse(result.map);
                map.sources = [path.relative(outputBase, qsPath)];


                fs.writeFileSync(mapPath, JSON.stringify(map));
                fs.writeFileSync(qsPath, data[i]);

                return {
                    outputPath: outputPath,
                    lex: lexes[i]
                };
            });


            typeof callback === 'function' && callback({
                outputPath: buildResults.map(function(r){return r.outputPath;}),
                ast: asts,
                js: finalSource,
                lex: [].concat.apply([],lexes),
                world: compiler.world,
                main: mainObj,
                errorList: errors, error: errors.length ? errors.join('\n\n') : false
            });
            console.log('OUTPUT: '+ buildResults.map(function(r){return r.outputPath;}))
        }
        //typeTable.search('Timer'))
        
        
        //console.log(config);
        //console.dir(cfg);
    };

    Object.assign(build, Compiler);
    function errorDrawer(error){
        if(error.rendered)
            return;

        var meaninglessMessages = [
            'look at this',
            'here',
            'I do not know what it is',
            'bad place',
            'check it out',
            'how dare you are',
            'fix it',
            'I think it is wrong',
            'screwed up'
        ];
        error.rendered = true;

        var pos = [error.row, error.col];
        var pointer = error.pointer;
        var suggestions = error.suggestions;

        var code = pointer.code,
            lines = code.split('\n'),
            row = pos[0],
            col = pos[1],
            i, _i, out = [], padding = 2, line, maxL,
            j, _j, currentRow;

        i = Math.max(row - padding - 1, 0);
        _i = Math.min(row + padding + 1, lines.length);
        maxL = (Math.log10(_i-1)+1)|0;

        for(i; i < _i; i++){

            currentRow = (i+1);
            if(currentRow >= i && currentRow <= _i) {
                out.push(currentRow + ': ' + cTools.pad(maxL - (currentRow + '').length) + lines[i]);
                if (currentRow === row)
                    out.push(cTools.pad(col + maxL + 1) + '^---- '+ meaninglessMessages[(Math.random()*meaninglessMessages.length)|0] +' ----');
            }

        }
        if(suggestions){
            suggestions = suggestions.map( function(item, i){
                return (item.description || '%NUM%').replace(/%NUM%/g, i+1) +item.matchTo;
            } );
        }
        var renderedError = (error.description/*.replace(/</g,'&lt;').replace(/>/g,'&gt;')*/ +' '+error.pointer+'\n\n'+
            'Source:\n'+ cTools.indent(1,out).join('\n')+'\n\n'+
            (suggestions && suggestions.length?'Suggestions:\n'+ cTools.indent(1,suggestions).join('\n').replace(/</g,'&lt;').replace(/>/g,'&gt;') +'\n\n':'')+
            (error.stack && error.stack.length ? 'Stacktrace:\n'+error.stack.map(function(item){
                return '\t'+item;
            }).join('\n') : '')
        );
        return renderedError;
    };

    if(module.parent){
        showHelp = function(error, e){
            throw new Error(error+(e?'\n'+e+'\n'+e.stack:''));
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