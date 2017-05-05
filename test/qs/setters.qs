def Page main
    Slider mySlider: 10
      from: 5
      to: 20

    ComboBox combo1: '#000'
      label: Укажите цвет текста надписи "Изображение"
      items: {
          '#000': 'black',
          '#fff': 'white',
          '#f00': 'red',
          '#0f0': 'green',
          '{{myColor}}': 'My'
      }
    CheckBox: false

    Variant v1
      a: 3
      b
        c: 3
        d: {{mySlider.to}}
    Label: {{v1.b.d}}