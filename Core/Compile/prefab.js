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

            for(var where in obj.instances){
                obj.instances[where].forEach(function (what) {
                    ctor.push('var '+what.name+' = new '+what.class+'()');
                });

            }

            for(var where in obj.values){
                var properties = obj.values[where];
                for(var propName in properties){
                    var prop = properties[propName];
                    ctor.push(
                        (where === '___this___' ? 'this' : where ) + '.set(\'' + prop.name + '\', '+ this.getPropertyValue(prop)+');');
                }

            }

            for(var where in obj.instances) {
                obj.instances[where].forEach(function (what) {
                    ctor.push((where === '___this___' ? 'this' : where ) + '.addChild(' + what.name + ');');
                });
            }
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
        __isProperty: function (cls, prop) {
            var info = this.world[(cls.class && cls.class.data) || cls.name],
                propInfo;
            if(!info)
                return false;

            propInfo = info.public[prop] || info.private[prop];
            if(propInfo)
                return propInfo;

            // TODO recursive go up

            return false;
            //debugger;
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

                /*if(obj.value) {
                    data.value = this.callMethod('__getValue', obj.value);
                }else{

                }*/

                // if(obj.items) => recursively go around. store links to collector
                // value: {val: value, deps: [o1, o2], type: function|raw|pipe}

                items = obj.ast.items;
                for (i = 0, _i = items.length; i < _i; i++) {
                    item = items[i];
                    itemName = (item.class && item.class.data) || (item.name && item.name.data);
                    var prop = this.callMethod('__isProperty', obj, itemName);
                    if (prop) {



                    } else if (itemName in this.world) {

                    } else {
                        moreDependencies = true;
                        this.addDependency(cls.name, item.class);
                    }
                    //obj.values[itemName] = item.value;
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
                var objectName = obj.name;
                if(obj === cls) {
                    objectName = '___this___';
                }

                /*
                 item = obj.ast;
                 if(item.value){
                 itemName = 'value';
                 var value = {
                 type: 'property',
                 name: 'value',
                 item: item,
                 info: this.callMethod('__isProperty', obj, 'value')
                 };


                 if(!(obj.name in cls.values))
                 cls.values[objectName] = {};

                 cls.values[objectName][itemName] = value;
                 }
                 */

               // debugger;

                for (i = 0, _i = items.length; i < _i; i++) {
                    item = items[i];
                    itemName = (item.class && item.class.data) || (item.name && item.name.data);

                    var prop = this.callMethod('__isProperty', obj, itemName);



                    if (prop) {

                        /*}
                         if (
                         (itemName in cls.public) ||
                         (itemName in cls.private)
                         ) {*/
                        var value = {
                            type: 'property',
                            name: itemName,
                            item: item,
                            info: prop
                        };
                        internals.push(value);

                        if(!(obj.name in cls.values))
                            cls.values[objectName] = {};

                        cls.values[objectName][itemName] = value;

                    }else if (itemName in this.world) {
                        var childItem = {
                            type: 'child',
                            class: item.class.data,
                            ast: item,
                            name: itemName,
                            values: {}
                        };
                        if (item.name){
                            childItem.name = item.name.data;
                        }else{
                            childItem.name = this.getUID(childItem.class);
                        }
                        //console.log(childItem.name)
                        this.callMethod('__dig', childItem, cls);

                        internals.push(childItem);

                        if(!('instances' in cls))
                            cls.instances = {};

                        (cls.instances[objectName] = cls.instances[objectName] || []).push(childItem);




                        if(item.value && item.value.length){

                            var childObjectName = childItem.name;

                            if(!(objectName in cls.values))
                                cls.values[childObjectName] = {};

                            prop = this.callMethod('__isProperty', item, 'value');

                            var value = {
                                type: 'property',
                                name: 'value',
                                item: item,
                                info: prop
                            };

                            if(!(childObjectName in cls.values))
                                cls.values[childObjectName] = {};

                            cls.values[childObjectName].value = value;
                        }

                        if(item.events && item.events.length){
                            console.log('&',item.events)
                        }


                    }


                }
                obj.items = internals;

                if(obj.class === 'VBox'){

                    //debugger;
                }
            }else{

            }

        }
    };
})();