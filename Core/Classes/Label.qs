@example: The most common usage is declaring a simple text label:
  ```qs
    Label: the label text
  ```

@info: Simple text element situated to the right of the preceding visual element. Thus, this component is similar to [Block](UI.Block). Label behaves like the HTML `span` element

@ns: UI.Controls
def UIComponent Label

    @info: The Label content.
    public String value

    @info: Color of the text in the HTML color notation
    public String color
