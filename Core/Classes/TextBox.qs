@info: Single line text input field

@ns: UI.Controls
def UIComponent TextBox

    @example: TextBox contains string from text property
        TextBox
            width: 350px
            text: someTextBox
    @info: **String** content of the field
    public String text

    @example: TextBox contains string from value property
        TextBox
            width: 350px
            value: someTextBox
    @info: Synonym for text
    public String value

    @example: Show string of text while value is empty
      TextBox name
        placeholder: type your name here
    @info: Grey text shown in the input field when no value is entered
    public String placeholder

    @example: Text color
        TextBox
            width: 300px
            color: red
    @info: Color of the text in the field. **String**, uses the CSS notation for colors.
    public String color

    @example: Label of $className
        TextBox
            width: 300px
            label: someTextBox
    @info: Label of $className
    public String label

    @example: Make a screen keyboard when TextBox focused
        HBox
            width: 700px
            TextBox
                width: 300px
                layout: ru
        Keyboard
    @info: Layout of corresponding keyboard
    public String layout: full

    @example: Does not allow to enter characters
        TextBox
            width: 300px
            color: #0f0
            text: "kjsdkjfnsdkjfnk"
            enabled: false
    @info: is interactive?
    public Boolean enabled: true

    @example: Does not allow to enter more characters then you need
        TextBox
            width: 300px
            maxLength: 3
    @info: maximum length of value
    public Number maxLength: -1

    @example: Set the comment
        TextBox
            width: 300px
            color: #0f0
    @info: comment of text box
    public String comment:

    @example: Set the length of text
        TextBox
            width: 300px
            length: 3
    @info: length of data in text box
    public Number length: 0