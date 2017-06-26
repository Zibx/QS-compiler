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
    @example: Set the direction of arrow button
        Button: "here's btn"
            direction: left

        Button: "here's btn2"
            direction: right

    @info: direction of button arrow
    public String direction

    @example: "Button's label"
        Button
            value: "here's btn"
    @info: Caption of the button
    public String value

/*
    @example: Set the list of commands that would be executed when the button is clicked
        Number count: 0
        Button btn: Меня нажали {{count}} раз
            .click: (){
                var bg1 = "yellow"
                var bg2 = "red"
                count=count + 1
                if (btn.background == bg1) {
                    btn.background = bg2;
                } else {
                btn.background = bg1;
                }
            }
    @info: Click event
    @arg: PointEvent e
    @arg: [String, Number]
      Array with Name and Age
    @example: Change color on click
        Button btn: Click me
          .click: ()-> btn.color = '#f00';
    public Event click
*/


    @example: Set filled property
        Button: "here's btn"
            filled: true
    @info: flag that make the button filled
    public Boolean filled

    public Function click