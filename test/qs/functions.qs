def Page main
    Slider s1: 10
        .change: ()->
            var x = 5;
            s1 = x

        .change: ()->
            var x = 5;
            (function(){
                s1 = x
            })();

        .change: (e)->
            console.log(e)