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
        });/*
        Object.defineProperty(this.public, 'value', {
            set: function(val){
                this.__namespace = val;

            },
            get: function(val){
                return this.__namespace;
            }
        })*/

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
        getTags: function(name, own){
            var val = this.tags[name];
            if(val) {
                return val
            }

            if(own)
                return false;

            var i, _i,
                list = this._extendList;

            if(!list.length)
                return false;

            for(i = 0, _i = list.length; i < _i; i++){
                val = this._extend[list[i]].getTags(name);
                if(val)
                    return val;
            }
            return false;
        },
        getTag: function(name, own){
            var tags = this.getTags(name, own);
            if(tags && tags.length)
                return tags[0].value;

            return false;
        },
        getPublic: function(name, own){
            var val = this.public[name];
            if(val)
                return val;

            if(own)
                return false;

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
        getPrivate: function(name, own){
            var val = this.private[name];
            if(val)
                return val;

            if(own)
                return false;

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
        _listAllProperties: function( own, collection ){
            collection = collection || {};
            if(!own){
                var i, _i, val,
                    list = this._extendList;

                for(i = 0, _i = list.length; i < _i; i++){
                    this._extend[list[i]].listAllProperties().forEach(function(name){
                        collection[name] = true;
                    });
                }
            }
            Object.keys(this.private).forEach(function(name){
                collection[name] = true;
            });

            Object.keys(this.public).forEach(function(name){
                collection[name] = true;
            });
            return collection;
        },
        listAllProperties: function( own ){
            return Object.keys(this._listAllProperties(own));
        },
        findMethod: function(method, own){
            var fn;

            fn = this.getTag(method);
            if(typeof fn === 'function') return fn;

            fn = this.getPrivate(method);
            if(typeof fn === 'function') return fn;

            fn = this.getPublic(method);
            if(typeof fn === 'function') return fn;

            return false;
        },
        findProperty: function(prop, own){
            var result;
            result = this.getPrivate(prop, own);
            if(result) return result;

            result = this.getPublic(prop, own);
            if(result) return result;

            return false;
        },
        findPropertyDefinition: function(name, own){
            var val = this.public[name];
            if(val)
                return this;

            var val = this.private[name];
            if(val)
                return this;

            if(own)
                return false;

            var i, _i,
                list = this._extendList;

            if(!list.length)
                return false;

            for(i = 0, _i = list.length; i < _i; i++){
                val = this._extend[list[i]].findPropertyDefinition(name, own);
                if(val)
                    return val;
            }

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
        getValue: function(name){
            if(name in this.values){
                var val = this.values[name];
                return val.getValue();
            }else{
                if(name === void 0){
                    return this.value;
                }
                return void 0;
            }
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
/*    Object.defineProperty(ClassMetadata.prototype, 'namespace', {
        set: function(val){
            this.__namespace = val;
            debugger;
        },
        get: function(val){
            return this.__namespace;
        }
    })*/
    return ClassMetadata;
})();