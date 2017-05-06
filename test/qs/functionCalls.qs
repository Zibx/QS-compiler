def Page main
  Timer t1
    interval: 500
    .tick: ()->
      console.log(8);
  Button b
    .click: ()->
      t1.start();