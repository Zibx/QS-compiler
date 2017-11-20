def Page main
    Button: btn
        .click: ()->
            this.addChild(new Button({value: 'sub'}));
            this.addChild(new Slider({value: 10, from: 0, to: 20}));