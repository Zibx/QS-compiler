def Page main
    transaction
        name: 123
    Slider s: {{transaction.name}}
        from:10
        .change: ()->
            l = transaction.serialize();
    Label l: {{transaction.serialize()}}