def Page main
  Header h
  Proximity p
  Printer prn
  Slider s: 0
  Trigger t: {{p.distance < 50 || s > 15 || p.distance > 20 || s < 30}}
    .trigger: ()->
      var x = p.distance < 50 || s > 15;
      prn.print();
      h = prn.template;