def Page main
  Button Button_I1: Knopa
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

  title: t1
  .onload: ()->
    this.title = 't3'
  .onload: ()->
    title = 't2'

  .onload: ()->
    s1 = 8
  .onload: ()->
    this.showNext()
  .onload: ()->
    showNext()

  Slider s2: 15
    from: {{this.value}}
    to: 200

  Label l3: {{s3}}

  Slider s3: 30
  Label l4: {{JSON(JSON(s3).l).h}}
  Label l5: {{s3+s3}}