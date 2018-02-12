def Page main

    Slider mySlider: {{num}}
      from: 5
      to: 20

    ComboBox combo1: "#000"
      label: Укажите цвет текста надписи "Изображение" //2
      items: {
          '#000': 'black',
          '#fff': 'white',
          '#f00': 'red',
          '#0f0': 'green',
          '{{myColor}}': 'My'
      }
    CheckBox: false

    Label: {{mySlider}}
    public Number num: 10

    DATA d0: 'x'
    DATA data: """a"""
      a: '1'
      b: "2"
      c: """3"""

    TextBox i
      value: """val0"""