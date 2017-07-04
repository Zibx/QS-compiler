def UIComponent Property
    public String key
    public String value
    //String query: {{key+'="'+value+'"'}}

    Button b1:
      .click: function(){
         console.log(key+'="' + value + '"');
      }