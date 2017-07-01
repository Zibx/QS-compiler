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


@info: Push button with a caption, capable of firing `click` events. The default button size (unless set explicitly) is 100px by 30px.
@ns: UI.Controls
def UIComponent Button
    @info: Caption of the button
    public String value

    @info: The click event of this object
    @arg: PointEvent e
    @arg: [String, Number]
      Array with Name and Age
    @example: Change color on click
        Button btn: Click me
          .click: ()-> btn.color = '#f00';
    public Event click

    @info: Direction of the button arrow
    public String direction

    @info: Flag making the button filled
    public Boolean filled
