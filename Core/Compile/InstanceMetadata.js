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
        ClassMetadata.call(this, cfg);
        if(cfg.ast && cfg.ast.tags){
            for(var i in cfg.ast.tags){
                this.addTag( i, cfg.ast.getTag( i ) );
            }
        }
        this.isPublic = !!cfg.isPublic;
        if(cfg.name)
            this.setName(cfg.name);
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
        if(!prop){
            if(this.class){
                prop = this.class.findProperty( name );
            }else{
                console.log('findProperty: No class in ', this.getName())
            }
        }
        return prop;
    };
    InstanceMetadata.prototype.getTag = function(name){
        var prop = ClassMetadata.prototype.getTag.call(this, name);
        if(!prop){
            if( this.class ){
                prop = this.class.getTag( name );
            }else{
                console.log( 'getTag: No class in ', this.getName() )
            }
        }

        return prop;
    };

    InstanceMetadata.prototype.findMethod = function(name){
        var method = ClassMetadata.prototype.findMethod.call(this, name);
        if(!method){
            if( this.class ){
                method = this.class.findMethod( name );
            }else{
                console.log( 'findMethod: No class in ', this.getName() )
            }
        }

        return method;
    };

    InstanceMetadata.prototype.listAllProperties = function(own, collection){
        collection = collection || {};
        ClassMetadata.prototype._listAllProperties.call(this, own, collection);
        if(this.class && !own)
            this.class._listAllProperties(own, collection);

        return Object.keys(collection);
    };

    InstanceMetadata.prototype.noName = false;
    InstanceMetadata.prototype.isPublic = false;

    return InstanceMetadata;
})();