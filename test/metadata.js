/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 2/7/17.

module.exports = (function () {
    'use strict';
    var assert = require('chai').assert;
    var build = require('../build'),
        fs = require('fs');

    describe('Metadata', function() {

        it('extract', function (done) {
            var crafted = build({
                lib: void 0,
                source: fs.readFileSync('test/qs/functions.qs') + ''
            }, function(result){
                console.log(result.ast.main.events.s1.change[0]._js);
                assert.equal(1,2);

                done();
            });

        });
    });

})();