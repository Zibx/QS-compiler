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
            extend: [],
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
        extend: null,
        name: null,
        namespace: null,
        variables: null,
        props: null,
        tags: null,
        ready: false,
        js: false,
        ast: null,

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
        }
    };
    return ClassMetadata;
})();