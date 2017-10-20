/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 10/20/17.

module.exports = (function(){
    'use strict';
    var ClassMetadata = require('./ClassMetadata');

    var InstanceMetadata = function(cfg){
        Object.assign(this, cfg);
    };

    InstanceMetadata.prototype = new ClassMetadata;
    InstanceMetadata.prototype.type = 'child';
    InstanceMetadata.prototype.getName = function(){
        if(this.name)
            return this.name;

        if(!this.ast.name){
            return false;
        }

        this.name = this.ast.name.data;

        return this.name;
    };
    InstanceMetadata.prototype.setName = function(name){
        this.ast.name = {data: name};
    };
    InstanceMetadata.prototype.findProperty = function(name){
        var prop = ClassMetadata.prototype.findProperty.call(this, name);
        if(!prop)
            prop = this.class.findProperty(name);
        return prop;
    };
    return InstanceMetadata;
})();