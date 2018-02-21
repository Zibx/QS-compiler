@nested

@info: The `RadioButton` UI control serves to select one element from a (short) list and behaves in a similar way to the HTML element `input` of the `radio` type (i.e. `<input type="radio">`). Always belongs to the `RadioButtonGroup` that contains one of several `RadioButton` elements.
@example: Choose the rectangle color using the `RadioButton` control.
    def Page radioButton_example
        header
            Header: Select rectangle color

        RadioButtonGroup color // this item would be created if not exists

        RadioButton: red
            displayValue: Red color
            group: color

        RadioButton: green
            displayValue: Green color (default)
            group: color
            active: true

        RadioButton: blue
            displayValue: Blue color
            group: color

        UIComponent
            width: 300px
            height: 300px
            background: {{color.value}}


@ns: UI.Controls
def UIComponent RadioButton

    @create: if not defined
    @info: The parent group that contains one or several `RadioButton` elements. Only single `RadioButton` can be active within a `RadioButtonGroup` element.
    public RadioButtonGroup group

    @info: `RadioButton` value
    public String value

    @info: `RadioButton` display value. If not set, the `value` will be used.
    public String displayValue

    @info: Only one `RadioButton` element of the `RadioButtonGroup`.
    public Boolean active
