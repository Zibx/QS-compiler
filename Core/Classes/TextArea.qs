@info: The `Textarea` component represents a multi-line text-editing control inherited from [UIComponent](UI.UIComponent)

@ns: UI.Controls
def UIComponent TextArea

    @info: Content of the field.
    public String text

    @info: Synonym for the `text` property.
    public String value

    @info: Gray text shown in the input field when no value is entered.
    @example:
        TextArea name
            placeholder: type your name here
            fontSize: 15px
            label: First Name
            height: 150px
    public String placeholder

    @info: Color of the text in the field, in the HTML notation for colors.
    public String color

    @info: `Textarea` label
    public String label

    @info: Layout of the visual keyboard, for example `en`, `ru`, `numeric`, `full`.
    public String layout: full

    @info: This Boolean attribute indicates that the user can modify the value of the control (set `false` to get the read-only TextArea). If this value isn't specified, the user can enter an unlimited number of characters.
    public Boolean enabled: true

    @info: The `maxLength` property sets the maximum number of characters (Unicode code points) user can enter.
    public Number maxLength

    @info: Text font size
    public Number fontSize