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
        __dig: function(obj, collector) {
            var item = obj.item,
                data;
            if(item.type === 'DEFINE'){

                data = {
                    class: item.class.data
                };
                if(!item.name){
                    item.name = {data: this.getUID(item.class.name)};
                }
                data.name = item.name.data;
                collector.variables[item.name.data] = data;

                data.value = this.callMethod('__getValue', obj.value);

                // if(obj.items) => recursively go around. store links to collector
                // value: {val: value, deps: [o1, o2], type: function|raw|pipe}

                if(obj.class === 'VBox'){

                    debugger;
                }
            }else{

            }

        }
    };
})();