@example: The most common usage is declaring a simple text header:
    Header: I am header!


@info: Simple text element situated to the right of the preceding visual element. Thus, this component is similar to [Block](UI.Block). Label behaves like the HTML `H1` element

@ns: UI.Controls
def Label Header

    @example: Set the string as label content
        Label
            value: Here's some text
    @info: The Label content.

    public String anchor
    public String align
    public String size
