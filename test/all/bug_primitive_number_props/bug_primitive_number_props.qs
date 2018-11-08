def Page main
  Slider s1
    from: 0
    to: 1
    step: 0.01

  Label l1: {{s1.toFixed(4)}}
  Label l2: {{(2).toFixed(s1)}}
  Label l3: {{(1+1).toFixed(s1)}}
  Label l4: {{2..toFixed(5)}}