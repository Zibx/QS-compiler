def Page main
    Slider s1
        .change: ()->
            [s1,s1].join('.')
            var h = new Array(s1).join('1');
        /*.change: ()->
            var h = {0:[1,2,3]}[0].join('1');*/
        .change: ()->
           // var h = [1].join('1');
