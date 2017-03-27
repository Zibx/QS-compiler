@ns: AwesomeNamespace

def Page ValidatorTestPage
    BillValidator bv
        enabled: {{cb1}}

    CheckBox cb1

    Label: {{bv.lastBill?bv.lastBill:''}}

    Label: {{bv.ready?"Готов":"Не готов"}}
        color: {{bv.ready? 'green':'red'}}