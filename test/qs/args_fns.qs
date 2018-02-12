def Page main
    Collection c1
      .f: (b)->
        return b>2;
      filter: function(a)->{
        return a>2;
      }
      dataSource: []