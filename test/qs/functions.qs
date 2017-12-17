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
    Number count
    //String query: {{key+'="'+value+'"'}}

    Button b1:
      .click: function(){
         debugger;
         console.log(key+'="' + value + '"');
      }
      .click: function(){
         key++;
         if(key){
            key
         }
         for(var i = 0; i<1;i++)
            key
        if(key)
            key
        for(var i = 0; i<1;i++){key?key:key}
      }
      .click: function(){
         count++;
         if(count){
            count
         }
         for(var i = 0; i<1;i++)
            count
        if(count)
            count
        for(var i = 0; i<1;i++){count?count:count}
      }
    Function f0: ()->
        var f;
        count++;
        if(count){
            count
        }
        for(var i = 0; i<1;i++)
            count
        if(count)
            count
        for(var i = 0; i<1;i++){count?count:count}

    public Function f1: ()->
        var f;
        count++;
        if(count){
            count
        }
        for(var i = 0; i<1;i++)
            count
        if(count)
            count
        for(var i = 0; i<1;i++){count?count:count}

    public Function f2: ()->
        var f;
        key++;
        if(key){
            key
        }
        for(var i = 0; i<1;i++)
            key
        if(key)
            key
        for(var i = 0; i<1;i++){key?key:key}

    Function f3: ()->
        var f;
        key++;
        if(key){
            key
        }
        for(var i = 0; i<1;i++)
            key
        if(key)
            key
        for(var i = 0; i<1;i++){key?key:key}

    Function f4: ()->
        var f;
        f=f+key;
        f=f+count;
        f+=key;
        f+=count;
        f*=key;
        f*=count;
        f/=key;
        f/=count;
        f-=key;
        f-=count;
        f|=key;
        f|=count;
        f&=key;
        f&=count;
        f^=key;
        f^=count;
        f%=key;
        f%=count;

    public Function f5: ()->
        var f;
        f=f+key;
        f=f+count;
        f+=key;
        f+=count;
        f*=key;
        f*=count;
        f/=key;
        f/=count;
        f-=key;
        f-=count;
        f|=key;
        f|=count;
        f&=key;
        f&=count;
        f^=key;
        f^=count;
        f%=key;
        f%=count;

    Function f6: ()->
        var f;
        key=f+key;
        key=key+f;
        key=f;
        key=key;

        key=count;
        key=f+count;
        key=count+f;
        key=count+key;

        key+=count;
        key+=f;
        key+=key;

        count=f+key;
        count=key+f;
        count=f;
        count=key;

        count=count;
        count=f+count;
        count=count+f;
        count=count+key;

        count+=count;
        count+=f;
        count+=key;
