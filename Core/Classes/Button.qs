@example: Press event handling example
  Button: 'Press me'
    margin: 12px
    //this button spans the entire available area by width and has a fixed height of 80 pixels
    width: 100%
    height: 80px
    background: #5555aa
    .click:()->
      this.background = '#aa3333'
      this.value = 'You pressed me!'


@info: Pushable button with a caption
@ns: UI.Controls
def UIComponent Button
    @info: Caption of the button
    public String value

    @info: Click event
    @arg: PointEvent e
      rot ebal
    @arg: [String, Number]
      Array with Name and Age
    @example: Change color on click
        Button btn: Click me
          .click: ()-> btn.color = '#f00';
    public Event click