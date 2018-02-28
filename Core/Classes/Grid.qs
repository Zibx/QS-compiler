@ns: UI.Controls
@info: Grid object with addressable rows and columns. A Grid is not visible and only serves to markup a screen area with the specified quantity of //rows// and //columns//.
    This Grid’s child elements can specify their height\width and top\left position by seting into property pureCss any CSS Grid Layout value.
def UIComponent Grid

    @example: Grid usage example
        Grid
            autoFlow: rows
            columns: 2
            Button: Show keyboard
                .click: ()->{
                    
                }
            Button: Hide keyboard
                .click: ()->{

                }

    @info: Number of columns and rows in the grid.

    @info: The grid-gap CSS property is a shorthand property for grid-row-gap and grid-column-gap specifying the gutters between grid rows and columns.
    public String gap

    @info: The grid-row CSS property is a shorthand property for grid-row-start and grid-row-end specifying a grid item’s size and location within the grid row by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area.
    public Number rows

    @info: The grid-column CSS property is a shorthand property for grid-column-start and grid-column-end specifying a grid item's size and location within the grid row by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area.
    public Number columns

    @info: The grid-template-rows CSS property defines the line names and track sizing functions of the grid rows.
    public String templateRows

    @info: The grid-template-columns CSS property defines the line names and track sizing functions of the grid columns.
    public String templateColumns

    @info: The grid-auto-flow CSS property controls how the auto-placement algorithm works, specifying exactly how auto-placed items get flowed into the grid.
    public Boolean autoFlow