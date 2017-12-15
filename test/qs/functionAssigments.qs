def Page main
    Function add: (a)->
        field = (field||'')+ '*'
    public Function addPublic: (a)->
        field = field.substr(0, field.length - 1);

    Header field
    Button: 1
        .click: ()->add()
    Button: 2
        .click: add