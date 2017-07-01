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
@info: Grid object with addressable rows and columns. A Grid is not visible and only serves to markup a screen area with the specified quantity of //rows// and //columns//.
This Grid’s child elements should specify their //left// and //top// property values, which will indicate (respectively) the column and the row of this Grid in which the corresponding child element is positioned.
def UIComponent Grid

    @info: Number of rows in the grid. Default: //1//
    public Number rows

    @info: Number of columns in the grid. Default: //1//
    public Number columns

    @arg: child
      The child component to be added
    @info: Add a child UI element to this element
    public Function addChild
