def Page main
  title: t1
  .onload: ()->
    this.title = 't2'
  Button: Knopa
    .click: ()->
      this++;
    .click: ()->
      this.value++;

  Variant:
    .click: ()->
      this++;
    .click: ()->
      this.value++;
    .click: ()->
      this.someVal++;

  Timer
    .tick: ()->
        this.enabled = false

  Slider s1: 15
    from: {{this}}
    to: 200