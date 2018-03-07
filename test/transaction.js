/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 7/14/17.


var assert = require('chai').assert;
var common = require('./toolchain/common'),
    compile = common.compile, compact = common.compact;

describe('Transaction', function() {
    compile(
`

def Page main
    Header: Lets collect transaction data
    TextBox t1
        layout: ru
        label: ФИО
        capitalize: true

    Button next
        .click: ()->
            transaction.update({fio: t1})
            NavigationManager.navigate('second')

def Processor process
    .process: (data)->
        console.log('#process', data);
        

def Page second
    Header: Ваше ФИО: {{transaction.fio}}

    Label: Возраст:
    Slider age: 16
        from: 10
        to: 120

    Button next
        .click: ()->
            transaction.update({age: age});
            NavigationManager.navigate('send')


def Page send
    Label: {{transaction.plain()}}
    `, {main: 'main'}, function (result) {
        var main = result.ast.main;
        it('should work as JSON', function(){

            assert.equal(main.values.c1.items._val, '{\n  "nk1": "ololo",\n  "nk2": 5467\n}')
        });
    });
});
