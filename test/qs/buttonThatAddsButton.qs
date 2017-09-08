def Page main
    Button: btn
        .click: ()->
            this.addChild(new Button({value: 'sub'}));