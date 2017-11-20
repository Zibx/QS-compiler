/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 10/19/17.

module.exports = (function () {
    'use strict';
    var Property = require('./Property');
    var Property = require('./Property');
    var ClassMetadata = function(cfg){
        Object.assign(this, {
            public: {},
            private: {},
            values: {},
            require: {},
            _extend: {},
            _extendList: [],
            variables: {},
            instances: {},
            props: {},
            tags: {},
            ast: {},
            items: [],
            subItems: {},
            events: {}
        });
        Object.assign(this, cfg);

        this.namespace = this.namespace || null;
    };
    ClassMetadata.prototype = {
        public: null,
        private: null,
        values: null,
        require: null,//info.require,
        events: {},
        _extend: null,
        _extendList: [],
        items: [],
        subItems: {},
        name: null,
        instances: null,
        namespace: null,
        variables: null,
        props: null,
        tags: null,
        ready: false,
        js: false,
        ast: null,
        extend: function(info){
            var name = info.getName();
            this.__extend(name, info);
        },
        __extend: function(name, info){
            if(!(name in this._extend)){

                this._extend[name] = info;
                this._extendList.push(name)
            }
        },
        getName: function(){
            if(typeof this.name === 'string'){
                return this.name;
            }else{
                return this.name.data;
            }
        },
        addPublic: function(name, value){
            this.public[name] =value;
            return this;
        },
        addTag: function(name, value){
            if(!(name in this.tags)){
                this.tags[name] = [];
            }
            this.tags[name].push({data: value, value: value});
            return this;
        },
        setNameSpace: function(ns){
            ns = ns || null;
            this.namespace = ns;
            this.addTag('ns', ns);
            return this;
        },
        getTag: function(name, own){
            var val = this.tags[name];
            if(val) {
                if(val.length === 1)
                    return val[0].value;
                else
                    console.log('lots of tags')
            }

            if(own)
                return false;

            var i, _i,
                list = this._extendList;

            if(!list.length)
                return false;

            for(i = 0, _i = list.length; i < _i; i++){
                val = this._extend[list[i]].getTag(name);
                if(val)
                    return val;
            }

            return false;
        },
        getPublic: function(name){
            var val = this.public[name];
            if(val)
                return val;

            var i, _i,
                list = this._extendList;

            if(!list.length)
                return false;

            for(i = 0, _i = list.length; i < _i; i++){
                val = this._extend[list[i]].getPublic(name);
                if(val)
                    return val;
            }

            return false;
        },
        getPrivate: function(name){
            var val = this.private[name];
            if(val)
                return val;

            var i, _i,
                list = this._extendList;

            if(!list.length)
                return false;

            for(i = 0, _i = list.length; i < _i; i++){
                val = this._extend[list[i]].getPrivate(name);
                if(val)
                    return val;
            }

            return false;
        },
        findMethod: function(method){
            var fn;

            fn = this.getTag(method);
            if(typeof fn === 'function') return fn;

            fn = this.getPrivate(method);
            if(typeof fn === 'function') return fn;

            fn = this.getPublic(method);
            if(typeof fn === 'function') return fn;

            return false;
        },
        findProperty: function(prop){
            var result;
            result = this.getPrivate(prop);
            if(result) return result;

            result = this.getPublic(prop);
            if(result) return result;

            return false;
        },
        addEvent: function(name, value){
            if(!(name in this.events))
                this.events[name] = [];

            this.events[name].push(value);
        },
        addValue: function(name, value){

            this.values[name] = value;
            /*if(!(name in this.values[whos]))
                this.values[whos][name] = [];

            this.values[whos][name].push(value);*/
        },
        addItem: function (objectName, item) {
            this.items.push(item);

            if(item instanceof Property){
                debugger;
            } else {
                if (!(objectName in this.instances)) {
                    this.instances[objectName] = [];
                }
                this.subItems[item.getName()] = item;
                this.instances[objectName].push(item);
                if (!item.noName) {
                    if (item.isPublic) {
                        this.public[item.getName()] = item;
                    } else {
                        this.private[item.getName()] = item;
                    }
                }
            }
        }
    };
    return ClassMetadata;
})();