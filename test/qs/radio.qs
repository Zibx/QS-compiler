def Page main
  title: adgfhv
  .onLoad: ()->
        2+2
  Border
    RadioButton: гусь
      group: animal
        enabled: {{rb}}

      displayValue: сова
    public RadioButton rb: bear
      group: animal
        enabled: {{rb}}
      displayValue: медведь
    Label l1: {{rb}}

    DATA data: """a"""
      a: '1'
      b: "2"
      c: """3"""