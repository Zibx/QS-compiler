/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */;// Copyright by Ivan Kubota. 1/8/2017

module.exports = (function(){
    'use strict';

    var process = function (ast) {

        var iterator = ast.getIterator(),
            token, data, count, quotes = {'\'':1, '"': 1}, quoteType;
        while(token = iterator.nextLeaf()){
            data = token.data;
            if(quotes[data]){
                quoteType = data;
                count = 1;
                while(token = iterator.nextLeaf()){
                    if (token.data === quoteType) {
                        count++;
                    } else {
                        break;
                    }
                }
                if(count % 2 === 0){
                    // open and close
                }else{
                    
                }

                console.log(count);
            }
        }

return;

        var out = '',it;
        for(var i = 0; i < 545; i++) {
            it = iterator.nextLeaf()
            out += it.type === 'Line'?'\n':it.data;
        }
        console.log(out)

        console.log(iterator.nextLeaf());
        console.log(iterator.nextLeaf());

        return;
        while( !iterator.lastLeaf ){

            token = iterator.nextLeaf();
            //console.log(token);
        }
    };

    return process;
})();