@info: Single line text input field

@ns: UI.Controls
def UIComponent TextBox

    @info: Content of the field
    public String text

    @info: Synonym for `text`
    public String value

    @example:
      TextBox name
        placeholder: type your name here
    @info: Grey text shown in the input field when no value is entered
    public String placeholder

    @info: Color of the text in the field, in the HTML notation for colors
    public String color

    @info: Label of $className
    public String label

    @info: Layout of the corresponding keyboard
    public String layout: full

    @info: is interactive?
    public Boolean enabled: true

    @info: maximum length of value
    public Number maxLength: -1

    @info: comment of text box
    public String comment:

    @info: length of data in text box
    public Number length: 0