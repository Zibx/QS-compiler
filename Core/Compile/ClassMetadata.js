/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 10/19/17.

module.exports = (function () {
    'use strict';
    var ClassMetadata = function(cfg){
        Object.assign(this, {
            public: {},
            private: {},
            values: {},
            require: {},
            _extend: {},
            _extendList: [],
            variables: {},
            props: {},
            tags: {},
            ast: {}
        });
        Object.assign(this, cfg);


    };
    ClassMetadata.prototype = {
        public: null,
        private: null,
        values: null,
        require: null,//info.require,
        _extend: null,
        _extendList: [],
        name: null,
        namespace: null,
        variables: null,
        props: null,
        tags: null,
        ready: false,
        js: false,
        ast: null,
        extend: function(info){
            var name = info.getName();
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
            this.namespace = ns;
            this.addTag('ns', ns);
            return this;
        },
        getTag: function(name, own){
            var val = this.tags[name];
            if(val)
                return val.value;

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
            var val = this.tags[name];
            if(val)
                return val.value;

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
            var val = this.tags[name];
            if(val)
                return val.value;

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
            if(typeof result === 'function') return result;

            result = this.getPublic(prop);
            if(typeof result === 'function') return result;

            return false;
        },
        addEvent: function(whos, name, value){
            if(!(whos in this.events))
                this.events[whos] = {};

            if(!(name in this.events[whos]))
                this.events[whos][name] = [];

            this.events[whos][name].push(value);
        },
        addValue: function(whos, name, value){
            if(!(whos in this.values))
                this.values[whos] = {};

            if(!(name in this.values[whos]))
                this.values[whos][name] = [];

            this.values[whos][name].push(value);
        }
    };
    return ClassMetadata;
})();