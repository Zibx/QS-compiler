@ns: UI.Controls
@info: Grid object with addressable rows and columns. A Grid is not visible and only serves to markup a screen area with the specified quantity of //rows// and //columns//.
    This Grid’s child elements can specify their height\width and top\left position by seting into property pureCss any CSS Grid Layout value.
def UIComponent Grid

    @example: Grid usage example
        Grid
            height:300px
            rows: 3
            columns: 5

            Border
                background: purple
                pureCss: 'grid-row-end: span 2; grid-column-end: span 2;'
            Border
                background: green
                pureCss: 'grid-row-end: span 2; grid-column-end: span 2;'
            Border
                background: yellow
                pureCss: 'grid-row-end: span 2; grid-column-end: span 2;'
            Border
                background: black
                pureCss: 'grid-row-end: span 2; grid-column-end: span 2;'

    @info: Number of columns and rows in the grid.
    public Number rows
    public Number columns
