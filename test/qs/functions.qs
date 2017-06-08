def Page main
    Number nMain
    Slider s1: 10
        from: 0
        to: 100
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
        .change: ()->
            if(true){
                var a;
                //var b;
            }

    VBox
      Number nInner



def UIComponent Property
    public String key
    public String value
    //String query: {{key+'="'+value+'"'}}

    Button b1:
      .click: function(){
         debugger;
         console.log(key+'="' + value + '"');
      }