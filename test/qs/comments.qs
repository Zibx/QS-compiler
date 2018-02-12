def Page main
    Button b1
        .click: ()->
            var x = 1;
            //var y = 2;
        .click: function()->
            var x = 1;
            //var y = 2;
        .click: function()->{
            var x = 1;
            //var y = 2;
    }
        .click: function(){
            var x = 1;
            //var y = 2;
        }
        .click: function(){
            if(true){
                var x = 1;
            }else{
                //var y = 2;
            }
        }
        .click: function(){
            if(true){
                //var x = 1;
            }else{
                var y = 2;
            }
        }
        .click: function(){
            while(true){
                //var x = 1;
                var y = 2;
            }
        }
        .click: function(){
            (function(){
                if(true){//var x=1;
                //var y=2
                var z = 3;
                }
                while(true){
                    //var x = 1;
                    var y = 2;
                }
            })()
        }
        .click: ()->var x=10;//var y = 4
        //.click: ()->var x=10;//var y = 4
        .click: ()->{var x=13;//var y = 4
        }