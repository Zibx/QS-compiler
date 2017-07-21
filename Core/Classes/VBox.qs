@example: Vertically aligned elements
  ```qs
    def Page main
      //This VBox draws the flag of the Netherlands
      VBox
        width: 400px
        div
          height: 100px
          background: darkred
        div
          height: 100px
          background: white
        div
          height: 100px
          background: darkblue
  ```

@info: Layout element capable of aligning child elements. The nested elements are aligned in a single vertical column. Child components can be dynamically added to a VBox.
@ns: UI.Controls
def FlexSizeComponent VBox
    @example: Demo for flexDefinition
        VBox
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
    @info: Contains all elements heights specifications for this VBox. In either case the values are separated by spaces.
    public String flexDefinition
