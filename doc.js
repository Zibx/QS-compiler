/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 5/2/17.

/*
eslint
no-undef: error,
max-statements: off,
global-require: off,
no-sync: off,
notice/notice: off,
prefer-destructuring: off,
sort-keys: off,
no-multi-assign: off,
no-console: off,
no-param-reassign: off,
max-lines: off,
no-magic-numbers: off,
max-params: off,
security/detect-non-literal-regexp: off,
security/detect-non-literal-fs-filename: off,
security/detect-object-injection: off,
flowtype-errors/show-errors: off,
flowtype/require-valid-file-annotation: off,
fp/no-mutating-methods: off,
fp/no-delete: off,
react/destructuring-assignment: off,
prettier/prettier: off,
line-comment-position: off,
padding-line-between-statements: off,
strict: off,
no-var: off,
one-var: off,
curly: off,
vars-on-top: off,
spaced-comment: off,
no-unused-vars: off,
prefer-arrow-callback: off,
no-void: off,
max-statements-per-line: off,
prefer-template: off,
no-implicit-coercion: off,
sort-vars: off,
flowtype/no-unused-expressions: off,
block-scoped-var: off,
object-shorthand: off,
operator-assignment: off,
guard-for-in: off,
no-loop-func: off,
no-shadow: off,
max-depth: off,
no-continue: off,
no-empty: off,
no-prototype-builtins: off,
*/

module.exports = (function () {
    'use strict';

    // var stringify = require('json-stable-stringify');

    var Fs = require('fs'),
        Path = require('path')
    function readDirRecursive(path, base) {
        if(!base)
            base = '';

        var entries = Fs.readdirSync(path);
        var ret = [];
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            var fullPath = Path.join(path, entry);
            var stat = Fs.statSync(fullPath);
            if (stat.isFile()) {
                /*if (entry == "TypeTable.js")
                 ret.push("module.exports.TypeTable=require('../" + fullPath.replace(/\\/g, "/") + "')");
                 else*/
                ret.push(Path.join(base,entry).replace(/\\/g, "/"));
            }
            if (stat.isDirectory()) {

                if(entry[0] !== '.') // SYSTEM
                    ret = ret.concat(readDirRecursive(fullPath, base?Path.join(base, entry):entry));
            }
        }
        return ret;
    };
    var extractTags = function(obj, name){
        if(!obj.tags || !obj.tags[name])
            return false;
        var items = obj.tags[name], vals;
        if(!items || !items.length)
            return false;

        return items.filter(function(tag){
            return tag.value;
        }).map(function(tag){

            var out = {info: typeof tag.value === 'string' ? tag.value : tag.value.map(function(item){return item.data;}).join('')};

            if(tag.children)
                out.text = (
                    drawChildrenData(
                        tokenTools.toString(
                            tag.children, [],void 0, {comments: true}
                        )
                    )
                );
            return out;
        });
    };
    var Compiler = require('./Core/Compile/Compiler');
    var marked = require('marked');
    var tokenTools = require('./Core/tokenTools');
    var renderer = function(text){
        extracted = {
            heading: {}
        };
        return marked(text+'');
    };
    var argumentsParser = function(args){
        return args.map(function(arg){
            var info = arg.info;
            delete arg.info;
            var stack = [];
            for(var i = 0, _i = info.length; i < _i; i++){
                var char = info[i];
                if(char === '[' || char === '(' || char === '{' || char === '<') {
                    stack.push(char);
                }
                if(char === ']' || char === ')' || char === '}' || char === '>') {
                    stack.length && stack.pop();
                }
                if(stack.length === 0 && (char === ' ' || char === '\t')){
                    break;
                }
            }
            return {
                type: info.substr(0, i),
                name: info.substr(i+1),
                info: renderer(arg.text)
            };
        });
    };
    var world;
    var render = new marked.Renderer();
    marked.setOptions({
        renderer: render,
        highlight: function (code, lang) {
            code = code
                .replace(
                    new RegExp('('+Object.keys(world).join('|')+')','g'),
                    '<span class="qs-hl-key">$1</span>'
                )
                .replace(/(def|define|function|public|:)/g,'<span class="qs-hl-kkwd">$1</span>')
                .replace(/(\/\/.*)/g,'<span class="qs-hl-cmt">$1</span>')
                .replace(/([\d]+\.*[\d]*|true|false)/g,'<span class="qs-hl-val">$1</span>')
                .replace(/({|}|\(|\))/g,'<span class="qs-hl-brace">$1</span>');
            return ('<div style="overflow: visible; position: relative; width: 95%; height: 100%; font-size: 14px;" class="Q-UI-LiveQS">' +
            '<div class="LiveQSCode" style="font-family: monospace;">'+
                code +
            '</div>' +
            '<div style="clear: both;"></div></div>');
        },
        code: function(code){
            return code.replace(/(\/\/.*)/g,'<span class="qs-hl-cmt">$1</span>');
        },
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: true,
        sanitize: false,
        smartLists: true,
        smartypants: true
    });

    var extracted;
    render.smartypants = true;
    render.breaks = true;
    render.gfm = true;

    render.heading = function(text, level){
        (extracted.heading[level] || (extracted.heading[level] = [])).push(text);
        extracted.heading.max = Math.min(extracted.heading.max||100, level);

        var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

        return '<h' + level + '><a name="' +
            escapedText +
            '" class="anchor" href="#' +
            escapedText +
            '"><span class="header-link"></span></a>' +
            text + '</h' + level + '>';
    };

    var drawChildrenData = function(childrenData){
        var minLength = childrenData.lines.filter(function(line){
            return line.length>0;
        }).map(function (line) {
            return line.replace(/^(\s*)(.*)/,'$1').length;
        }).reduce(function (a, b) {
            // TODO check for single line case
            return a<b?a:b;
        });
        var spaces = new RegExp('^'+new Array(minLength+1).join(' '));
        return childrenData.lines.map(function(line){
            return line.replace(spaces, '');
        }).join('\n');
    };
    var getTag = function(ast, tagName){
        var out = compiler.getTag(ast, tagName),
            childrenData;
        if(out === false)
            return false;
        var children = ast.tags[tagName][0].children;
        if(children) {
            childrenData = tokenTools.toString(ast.tags[tagName][0].children, [],void 0, {comments: true});


            out += '\n'+drawChildrenData(childrenData)
        }
        return out;
    };
    var compiler;
    var doDoc = function () {


        compiler = new Compiler({});

        world = compiler._world;
        var item;
        var out = [];
        for (var i in world) {
            item = world[i];
            if (item.ast && !item.ast.js) {
                var collector = {};
                out.push(collector);
                collector.name = item.getName();
                collector.namespace = item.namespace;

                var info = getTag(item.ast, 'info');
                if (info) {
                    collector.info = renderer(info);//.replace(/\n/g,'<br>');
                }

                var examples = extractTags(item.ast, 'example');
                if (examples) {
                    collector.example = examples;
                }
                var props = collector.props = [],
                    events = collector.events = [],
                    fns = collector.fns = [];


                var propsList = item.listAllProperties()
                    .map(function(name){return item.findProperty(name);})
                    .filter(function(item){ return item.isPublic; });

                for(var p = 0, _p = propsList.length; p < _p; p++){

                    var prop = {};

                    var itemProp = propsList[p];
                    prop.name = itemProp.getName();
                    prop.type = itemProp.class.getName();

                    prop.defined = item.findPropertyDefinition(prop.name)
                    var own = prop.own = prop.defined === item;

                    if (!prop.own) {
                        prop.owner = prop.defined.namespace + '.' + prop.defined.name.data;
                    }

                    if(prop.defined === void 0){
                        if(console.combine){
                            console.combine(i+'.'+prop.name, function(list){
                                return 'Documentation property `defined` is not set for ['+ list.join(', ') +']';
                            });
                        }else {
                            console.log('Documentation property `defined` is not set for ' + i + '.' + prop.name);
                        }
                        continue;
                    }

                    var ast = itemProp.ast;

                    info = itemProp;//item.mixed.ast.public[p];
                    var infoTag = getTag(ast, 'info');

                    if (infoTag) {
                        prop.info = renderer(infoTag);
                    }else{
                        prop.info = '<i style="color:#ccc">No description yet</i>';
                    }

                    if(info) {
                        prop.examples = extractTags(info.ast, 'example');
                        if (prop.examples) {

                            prop.info += prop.examples.map(function (example) {
                                return '<div class="doc-prop-example"><h4>' + example.info + '</h4><p>' + renderer('```qs\n' + example.text + '\n```') + '</p></div>'
                            }).join('\n');

                        }
                    }

                    if(prop.type === 'Event'){
                        var args = extractTags(ast, 'arg');

                        if(args)
                            prop.args = argumentsParser(args);
                        events.push(prop);
                    }else if(prop.type === 'Function'){
                        fns.push(prop);
                    }else{
                        props.push(prop);
                    }
                    if(prop.defined){
                        if(prop.defined.class){
                            prop.defined = [prop.defined.getName(), prop.defined.class.getName()].join( '.' )
                        }else{
                            prop.defined = prop.defined.getName();
                        }
                    }else{
                        prop.defined = 'Core';
                    }


                }
                props.sort(function (a, b) {
                    return a.name > b.name ? 1 : -1;
                });

            }
        }
        /*out.forEach(function (o) {
            if (o.name === 'Slider')
                console.log(JSON.stringify(o, null, 2))
        });*/
        var docsDir = Path.join(__dirname, 'Core/Docs');
        readDirRecursive(docsDir).forEach(function(fileName){
            var content = Fs.readFileSync(
                Path.join(docsDir, fileName)
            );
            var parts = Path.parse(fileName);
            var item = {
                type: parts.dir,
                file: fileName,
                fileName: parts.name,
                data: '<div class="docArticle">'+renderer(content+'')+'</div>'
            };

            if(extracted.heading.max)
                item.title = extracted.heading[extracted.heading.max][0];

            out.push(item);
        });


        //console.log(docs)

        return out;
    };
    if(module.parent){

    }else{
        // const r =
        doDoc();

        // Fs.writeFileSync('../../aliceklipper/akb/doc.old.json', stringify(r, { space: 4 }));
    }
    return doDoc;
})();