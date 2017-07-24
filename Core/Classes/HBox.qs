@example: Horizontally aligned components
    def Page main
      //this HBox draws the flag of France
      HBox

        //This property sets the widths of the three child elements
        flexDefinition: 100px 100px 100px

        UIComponent
          height: 200px
          background: darkblue
        UIComponent
          height: 200px
          background: white
        UIComponent
          height: 200px
          background: darkred

@info: Layout element capable of aligning child elements. The nested elements are left-aligned in a single horizontal row. Child components can be dynamically added to an HBox.
@ns: UI.Controls
def FlexSizeComponent HBox
    @example: Demo for flexDefinition
        HBox
            flexDefinition: 200px 200px 200px

            Image
                width: 100px
                height: 100px
                source: ../../img/aeroflot.png

            Image
                width: 100px
                height: 100px
                source: ../../img/aeroflot.png

            Image
                width: 100px
                height: 100px
                source: ../../img/aeroflot.png
    @info: Contains all elements widths specifications for this HBox. In either case the values are separated by spaces.
    public String flexDefinition


