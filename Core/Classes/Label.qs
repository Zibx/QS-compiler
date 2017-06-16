@example: The most common usage is declaring a simple text label:
    Label: the label text

@info: Simple text element situated to the right of the preceding visual element. Thus, this component is similar to [[Block]]. Label behaves like the HTML span element

@ns: UI.Controls
def UIComponent Label

    @example: The Label content
        Label
            value: Here's some text
    @info: The Label content.
    public String value

    @example: Text color
        Label: The fox provides for himself
                color: white
        Label: So many books, so little time
            color: #f00
        Label: There is nothing permanent except change
            color: #00ff00
        Label: You cannot shake hands with a clenched fist
            color: rgb(0,0,255)
        Label: Learning never exhausts the mind
            color: rgba(255,255,255,.5)
    @info: Color of the text in HTML color format
    public String color

