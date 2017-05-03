def Page main
    Number nMain
    Slider s1: 10
        public from: 0
        public to: 100
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

        .change: ()->
            nInner = s1;
            console.log(nInner, nMain);
    VBox
      Number nInner
