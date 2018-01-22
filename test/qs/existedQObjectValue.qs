def Page main
    Dialog d1
        header: h1
            .click: function(){
                console.log('click')
            }
    Dialog d2
        header
            value: h2