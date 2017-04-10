/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
// QUOKKA 2017
// By zibx on 4/10/17.

def Page ValidatorTestPage
    CheckBox cb1: false
    BillValidator bv1
        enabled: {{cb1}}
    Label: Последняя деньга: {{bv1.lastBill?bv1.lastBill:''}}

    Label: {{bv1.ready?'Готов':'Не готов'}}
        color: {{bv1.ready?'green':'red'}}