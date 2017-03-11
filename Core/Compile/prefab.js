/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 3/6/17.

module.exports = (function () {
    'use strict';
    var esprima = require('esprima'),
        escodegen = require('escodegen');

    return {
        __compile: function(obj){
            var baseClassName = obj.extend[0];
            var source = [],
                i, ctor = [], props = [], cfg;



            source.push('var '+ obj.name +' = '+ baseClassName +
                '.extend(\'App'+baseClassName+'\', \''+obj.name+'\', {');


            ctor.push('ctor: function(){');
            
            //obj.public
            
            ctor.push('}');
            for(i in obj.public){
                props.push(i+':{}')
            }
            ctor = ctor.join('\n');
            props = '_prop: {\n'+props.join(',\n')+'\n}\n';



            cfg = [ctor, props];

            source.push(cfg.join(','));



            source.push('});');




            return escodegen.generate(
                esprima.parse(source.join('\n'))
            );
        },
        __dig: function(obj, cls) {
            var item = obj.ast,
                data, itemName, i, _i, items,
                moreDependencies = false;

            if(item.type === 'DEFINE'){

                data = {
                    class: obj === cls ? item.name.data : item.class.data
                };
                if(!item.name){
                    item.name = {data: this.getUID(item.class.name)};
                }
                data.name = item.name.data;
                cls.variables[item.name.data] = data;

                if(obj.value) {
                    data.value = this.callMethod('__getValue', obj.value);
                }else{

                }

                // if(obj.items) => recursively go around. store links to collector
                // value: {val: value, deps: [o1, o2], type: function|raw|pipe}

                items = obj.ast.items;
                for (i = 0, _i = items.length; i < _i; i++) {
                    item = items[i];
                    itemName = (item.class && item.class.data) || (item.name && item.name.data);
                    if (
                        (itemName in cls.public) ||
                        (itemName in cls.private)
                    ) {

                    } else if (itemName in this.world) {

                    } else {
                        moreDependencies = true;
                        this.addDependency(cls.name, item.class);
                    }
                    cls.values[itemName] = item.value;
                }
                /*
                 1) create named with not piped properties or inline pipes to properties that are already defined
                 2) create unnamed with inline pipes
                 3) create other pipes
                 4) add items as children
                 */

                if (moreDependencies) {
                    console.log('More deps for `' + cls.name + '`: ' + this.wait[cls.name])
                    return;
                }

                var internals = [];
                for (i = 0, _i = items.length; i < _i; i++) {
                    item = items[i];
                    itemName = (item.class && item.class.data) || (item.name && item.name.data);
                    if (
                        (itemName in cls.public) ||
                        (itemName in cls.private)
                    ) {
                        internals.push({
                            type: 'property',
                            name: itemName,
                            item: item
                        });
                    } else if (itemName in this.world) {
                        var childItem = {
                            type: 'child',
                            class: item.class.data,
                            ast: item,
                            name: itemName
                        };
                        if (item.name){
                            childItem.name = item.name.data;
                        }else{
                            childItem.name = this.getUID(childItem.class);
                        }
                        console.log(childItem.name)
                        this.callMethod('__dig', childItem, cls);

                        internals.push(childItem);
                    }
                }
                obj.items = internals;

                if(obj.class === 'VBox'){

                    debugger;
                }
            }else{

            }

        }
    };
})();