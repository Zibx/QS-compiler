@example: Grid usage example
  def Page main

    Grid
      width: 100%  // X-stretch to entire page
      height: 100% // Y-stretch to entire page
      rows: 2     // the grid space is divided into 2 rows
      columns: 2  // the grid space is divided into 2 columns

      Label: 'top left quadrant'
        left: 0
        top: 0

      Label: 'top right quadrant'
        left: 1
        top: 0

      Label: 'bottom left quadrant'
        left: 0
        top: 1

      Label: 'bottom right quadrant'
        left: 1
        top: 1

@ns: UI.Controls
@info: Grid object with addressable rows and columns. A Grid is not displayed and only serves to markup the area that it occupies on the screen with the specified quantity of //rows// and //columns//. This Grid’s child elements should specify their //left// and //top// property values, which will indicate (respectively) the column and the row of this Grid in which the corresponding child element is positioned.\\
def UIComponent Grid

    @example: Demo of rows
        Grid
            rows: 5

            Border
                height: 100px
                background: purple
                top: 0

            Border
                height: 100px
                background: red
                top: 1

            Border
                height: 100px
                background: green
                top: 2

            Border
                height: 100px
                background: yellow
                top: 3

            Border
                height: 100px
                background: grey
                top: 4
    @info: **Number** of rows in the grid. Default: //1//
    public Number rows

    @example: Demo of columns
        Grid
            width: 500px
            columns: 5

            Border
                width: 70px
                background: purple
                left: 0

            Border
                width: 70px
                background: red
                left: 1

            Border
                width: 70px
                background: green
                left: 2

            Border
                width: 70px
                background: yellow
                left: 3

            Border
                width: 70px
                background: grey
                left: 4
    @info: **Number** of columns in the grid. Default: //1//
    public Number columns

    @attr: child
//      info: The child component to be added
    @info: Add a child UI component to this component
    public Function addChild
