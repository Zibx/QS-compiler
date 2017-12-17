def Page main
    Function add: (a)->
        field = (field||'')+ '*'
    public Function addPublic: (a)->
        //field = (field||'')+ '*'
        field = field.substr(0, field.length - 1);

    Header field
    Button b1: 1
        .click: ()->add()
    Button b2: 2
        .click: add
    Button b3: 3
        .click: ()->addPublic()
    Button b4: 4
        .click: addPublic