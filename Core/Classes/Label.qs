@example: The most common usage is declaring a simple text label:
    Label: the label text


@info: Simple text element situated to the right of the preceding visual element. Thus, this component is similar to [Block](UI.Block). Label behaves like the HTML `span` element

@ns: UI.Controls
def UIComponent Label

    @example: Set the string as label content
        Label
            value: Here's some text
    @info: The Label content.
    public String value

    @info: Set the color of the text in HTML color format.
        Example:
        Color can be set with color name.
        ```qs
        Label: The fox provides for himself
            color: white
        ```
        Or with shorthand hex code.
        ```qs
        Label: So many books, so little time
            color: #f00
        ```
        Or with hex code.
        ```qs
        Label: There is nothing permanent except change
            color: #00ff00
        ```
        Or with rgb code.
        ```qs
        Label: You cannot shake hands with a clenched fist
            color: rgb(0,0,255)
        ```
        Or with rgba code.
        ```qs
        Label: Learning never exhausts the mind
            color: rgba(255,255,255,.5)
        ```
    public String color

